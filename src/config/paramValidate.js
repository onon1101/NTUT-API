import { checkSchema, validationResult } from 'express-validator';

const authCourseSchema = async (req, res, next) => {
  await checkSchema({
    year: {
      isInt: true,
    },
    semester: {
      // 一定為字串, 不然就顯示錯誤
      isInt: {
        errorMessage: 'semester must be integer',
      },
    },
    department: {
      // 一定為字串, 不然就顯示錯誤
      isString: {
        withMessage: 'department must be string',
      },
    },
  }).run(req);

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.send({ error: errors.array() });
  }
};

export default {
  authCourseSchema,
};
