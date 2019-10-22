//========= Mock Object.defineProperty to always allow overriding =========
const originalDefineProperty = Object.defineProperty;
const originalDefineProperties = Object.defineProperties;
Object.defineProperty = (obj, prop, desc) => {
  return originalDefineProperty(obj, prop, {...desc, configurable: true});
};
Object.defineProperties = (obj, props) => {
  Object.keys(props).forEach((key) => {
    props[key].configurable = true;
  });
  return originalDefineProperties(obj, props);
};
//=========================================================================