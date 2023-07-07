import pangu from 'pangu';

const spacing = (str) => {
  if (str === '') {
    return str;
  }
  return pangu.spacing(str);
};

export default spacing;
