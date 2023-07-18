import classSchedule from '../modules/getClassSchedule.module';

const getPersonalClassSchedule = async (req, res, next) => {
  // const { year, semester } = req.params;
  classSchedule.main()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
};

export default {
  getPersonalClassSchedule,
};
