const inquirer = require('inquirer');
const colors = require('colors');
const replace = require('replace-in-file');
const path = require('path');
const { mv, rm, which, exec } = require('shelljs');
const fs = require('fs');

const modifyFiles = [
  'package.json',
  'example/index.tsx',
];

inquirer.prompt([
  {
    type: 'input',
    name: 'libName',
    message: '请问你的库的名字是？',
  },
])
.then((answer:{libName:string}) => {
  modifyContents(answer.libName);
  removeInit();
  finalize();
  console.log(colors.cyan("OK, you're all set. Happy coding!! ;)\n"));
});

const modifyContents = (libName:string) => {
  console.log(colors.underline.white('Modified'));
  const files = modifyFiles.map((f) => path.resolve(__dirname, f));
  try {
    const changes = replace.sync({
      files,
      from: [/--libraryname--/g],
      to: [libName],
    });
    console.log(colors.yellow(modifyFiles.join('\n')));
  } catch (error) {
    console.error('An error occurred modifying the file: ', error);
  }

  console.log('\n');
};

const removeInit = () => {
  console.log(colors.underline.white('Removed init.ts'));

  rm('-rf', path.resolve(__dirname, './init.ts'));

  console.log('\n');
};

const finalize = () => {
  console.log(colors.underline.white('Finalizing'));

  // Remove post-install command
  const jsonPackage = path.resolve(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(jsonPackage) as any);

  // Note: Add items to remove from the package file here
  delete pkg.scripts.postinstall;

  const space = 2;
  fs.writeFileSync(jsonPackage, JSON.stringify(pkg, null, space));
  console.log(colors.green('Postinstall script has been removed'));

  console.log('\n');
};