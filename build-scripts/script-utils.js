const getArgValue = (args, name, defaultVal) => {
  const index = args.indexOf(name);
  if (index < 0) return defaultVal;
  return args[index + 1];
};

const getArgExists = (args, name) => {
  const index = args.indexOf(name);
  return index > -1;
};

module.exports = {
  getArgValue,
  getArgExists,
};
