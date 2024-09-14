function parseArgs(args) {
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split("=");
    acc[key.replace("--", "")] = value;
    return acc;
  }, {});
}

function getArgs() {
  const args = process.argv.slice(2);

  return parseArgs(args);
}

module.exports = {
  getArgs,
};
