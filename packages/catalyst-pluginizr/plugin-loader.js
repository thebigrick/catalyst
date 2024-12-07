/**
 * @fileoverview A webpack loader that wraps React components with a plugin system.
 * This loader automatically detects React components and wraps them with the withPlugins HOC
 * from @thebigrick/catalyst-pluginizr.
 * @module @thebigrick/catalyst-pluginizr
 */

const generate = require('@babel/generator').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Determines if a function node represents a React component by checking for JSX elements
 * @param {Object} funcNode - The function node to analyze
 * @returns {boolean} True if the function contains JSX elements
 */
const isReactComponentFunction = (funcNode) => {
  let hasJSX = false;
  const bodyNode = t.isFunctionDeclaration(funcNode)
    ? [funcNode]
    : [t.expressionStatement(funcNode)];
  const tempAST = t.file(t.program(bodyNode));

  traverse(tempAST, {
    JSXElement: () => {
      hasJSX = true;
    },
    JSXFragment: () => {
      hasJSX = true;
    },
  });

  return hasJSX;
};

/**
 * Searches for a file by walking up directory tree from a starting point
 * @param {string} filename - The name of the file to find
 * @param {string} startDir - The directory to start searching from
 * @returns {string|null} The full path to the found file, or null if not found
 */
const findUp = (filename, startDir) => {
  let dir = startDir;

  while (dir !== path.parse(dir).root) {
    const candidate = path.join(dir, filename);

    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }

  return null;
};

/**
 * Extracts package name from package.json file
 * @param {string} packageJsonPath - Path to package.json file
 * @returns {string} Package name or 'unknown-package' if not found
 */
const getPackageName = (packageJsonPath) => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  return pkg.name || 'unknown-package';
};

/**
 * Gets baseUrl from tsconfig.json file
 * @param {string|null} tsconfigPath - Path to tsconfig.json file
 * @returns {string|null} baseUrl from compiler options or null if not found
 */
const getBaseUrl = (tsconfigPath) => {
  if (!tsconfigPath) return null;

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

  return tsconfig.compilerOptions?.baseUrl || null;
};

/**
 * Removes file extension from path
 * @param {string} filePath - File path with extension
 * @returns {string} File path without extension
 */
const removeExtension = (filePath) => filePath.replace(/\.[jt]sx?$/, '');

/**
 * Calculates relative path without baseUrl
 * @param {string} fileFullPath - Absolute file path
 * @param {string} projectDir - Project root directory
 * @param {string|null} baseUrl - Base URL from tsconfig
 * @returns {string} Relative path using forward slashes
 */
const relativePathWithoutBaseUrl = (fileFullPath, projectDir, baseUrl) => {
  const relativeToProject = path.relative(path.join(projectDir, baseUrl || ''), fileFullPath);

  return relativeToProject.split(path.sep).join('/');
};

/**
 * Gets project root directory from package.json location
 * @param {string} packageJsonPath - Path to package.json
 * @returns {string} Project root directory
 */
const getProjectRootFromPackageJson = (packageJsonPath) => path.dirname(packageJsonPath);

/**
 * Generates component code path for plugins
 * @param {string} filename - Component file name
 * @param {string} identifierName - Component identifier name
 * @param {boolean} [isDefaultExport=false] - Whether component is default export
 * @returns {string} Formatted component code path
 * @throws {Error} If package.json is not found
 */
const getComponentCode = (filename, identifierName, isDefaultExport = false) => {
  const absolutePath = path.isAbsolute(filename) ? filename : path.resolve(process.cwd(), filename);

  const packageJsonPath = findUp('package.json', path.dirname(absolutePath));

  if (!packageJsonPath) {
    throw new Error(`No package.json was found for ${filename}`);
  }

  const tsconfigPath = findUp('tsconfig.json', path.dirname(absolutePath));

  const info = {
    packageJsonPath,
    packageName: getPackageName(packageJsonPath),
    tsconfigPath,
    baseUrl: getBaseUrl(tsconfigPath),
    projectRoot: getProjectRootFromPackageJson(packageJsonPath),
  };

  const relativePath = relativePathWithoutBaseUrl(absolutePath, info.projectRoot, info.baseUrl);
  let relativePathNoExt = removeExtension(relativePath);

  const parts = relativePathNoExt.split('/');

  if (parts[parts.length - 1] === 'index') {
    parts.pop();
  }

  relativePathNoExt = parts.join('/');

  return isDefaultExport
    ? `${info.packageName}/${relativePathNoExt}`
    : `${info.packageName}/${relativePathNoExt}:${identifierName}`;
};

/**
 * Normalizes function body to ensure it has a block statement
 * @param {Object} funcNode - Function node to normalize
 * @returns {void}
 */
const normalizeFunctionBody = (funcNode) => {
  if (
    (t.isArrowFunctionExpression(funcNode) || t.isFunctionExpression(funcNode)) &&
    !t.isBlockStatement(funcNode.body)
  ) {
    funcNode.body = t.blockStatement([t.returnStatement(funcNode.body)]);
  }
};

/**
 * Wraps a function with plugins
 * @param {Object} funcNode - Function node to wrap
 * @param {string} identifierName - Function identifier name
 * @param {string} filename - File name
 * @param {boolean} [isDefaultExport=false] - Whether function is default export
 * @returns {Object} Wrapped function node
 */
const wrapFunctionWithPlugins = (funcNode, identifierName, filename, isDefaultExport = false) => {
  const cloned = t.cloneNode(funcNode, true);

  normalizeFunctionBody(cloned);

  const componentCode = getComponentCode(filename, identifierName, isDefaultExport);

  return t.callExpression(t.identifier('withPlugins'), [
    t.stringLiteral(componentCode),
    t.functionExpression(
      t.identifier(identifierName),
      cloned.params,
      cloned.body,
      cloned.generator,
      cloned.async,
    ),
  ]);
};

/**
 * Wraps exported functions with plugins
 * @param {string} code - Source code
 * @param {string} filename - File name
 * @returns {string} Transformed code with wrapped exports
 */
const wrapExportedFunctions = (code, filename) => {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  let withPluginsImported = false;

  traverse(ast, {
    ImportDeclaration: (declPath) => {
      if (declPath.node.source.value === '@thebigrick/catalyst-pluginizr') {
        if (
          declPath.node.specifiers.some(
            (spec) => t.isImportSpecifier(spec) && spec.imported.name === 'withPlugins',
          )
        ) {
          withPluginsImported = true;
        }
      }
    },
  });

  if (!withPluginsImported) {
    ast.program.body.unshift(
      t.importDeclaration(
        [t.importSpecifier(t.identifier('withPlugins'), t.identifier('withPlugins'))],
        t.stringLiteral('@thebigrick/catalyst-pluginizr'),
      ),
    );
  }

  const handleVariableDeclaration = (declarations, exportPath) => {
    let modified = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const decl of declarations) {
      const { id, init } = decl;

      if (
        t.isIdentifier(id) &&
        init &&
        (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init))
      ) {
        if (isReactComponentFunction(init)) {
          decl.init = wrapFunctionWithPlugins(init, id.name, filename);
          modified = true;
        }
      }
    }

    if (modified) {
      exportPath.replaceWith(
        t.exportNamedDeclaration(
          t.variableDeclaration(exportPath.node.declaration.kind, declarations),
          [],
        ),
      );
    }
  };

  traverse(ast, {
    ExportNamedDeclaration: (declPath) => {
      const { node } = declPath;
      const decl = node.declaration;

      if (decl && t.isFunctionDeclaration(decl) && decl.id && isReactComponentFunction(decl)) {
        const funcName = decl.id.name;
        const wrapped = wrapFunctionWithPlugins(decl, funcName, filename);

        declPath.replaceWith(
          t.exportNamedDeclaration(
            t.variableDeclaration('const', [t.variableDeclarator(t.identifier(funcName), wrapped)]),
            [],
          ),
        );
      } else if (decl && t.isVariableDeclaration(decl)) {
        handleVariableDeclaration(decl.declarations, declPath);
      }
    },
    ExportDefaultDeclaration: (declPath) => {
      const decl = declPath.node.declaration;

      if (
        (t.isArrowFunctionExpression(decl) || t.isFunctionExpression(decl)) &&
        isReactComponentFunction(decl)
      ) {
        const baseName = filename.replace(/\.[jt]sx?$/, '');
        const funcName = `${baseName}Default`;
        const wrapped = wrapFunctionWithPlugins(decl, funcName, filename, true);

        declPath.replaceWith(t.exportDefaultDeclaration(wrapped));
      } else if (t.isIdentifier(decl)) {
        const name = decl.name;
        const binding = declPath.scope.getBinding(name);

        if (binding && binding.path.isVariableDeclarator()) {
          const init = binding.path.node.init;

          if (
            init &&
            (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) &&
            isReactComponentFunction(init)
          ) {
            const wrapped = wrapFunctionWithPlugins(init, name, filename, true);

            binding.path.get('init').replaceWith(wrapped);
          }
        }
      }
    },
  });

  return generate(ast, {}, code).code;
};

/**
 * Webpack loader that wraps React components with plugins
 * @param {string} inputCode - Source code to transform
 * @returns {string} Transformed code
 */
function pluginizerModifier(inputCode) {
  return wrapExportedFunctions(inputCode, this.resourcePath);
}

module.exports = pluginizerModifier;
