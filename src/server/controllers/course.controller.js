import courseModule from '../modules/getCourse.module';
import yearModule from '../modules/getSchoolSemester.module';
import departmentModule from '../modules/getDepartment.module';

const getCourse = (req, res, next) => {
  const { year, semester, department } = req.params;
  courseModule(year, semester, department)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
};

const getYears = (req, res, next) => {
  yearModule()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
};

const getDepartment = (req, res, next) => {
  departmentModule()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export default {
  getCourse,
  getYears,
  getDepartment,
};
