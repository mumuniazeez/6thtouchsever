import { Op, Sequelize } from "sequelize";
import Course from "../../models/Course.js";
import User from "../../models/User.js";
import Payment from "../../models/Payment.js";

/**
 * User Get All Published Courses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllPublishedCourse = async (req, res) => {
  try {
    let courses = await Course.findAll({
      where: {
        isPublished: true,
      },
      include: { all: true },
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "No course available",
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};

/**
 * User Get All Published Courses By Category
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllPublishedCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    let courses = await Course.findAll({
      where: {
        isPublished: true,
        category,
      },
      include: { all: true },
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "No course found under this category",
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};

/**
 * User Get All Course By Id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getCourseByID = async (req, res) => {
  try {
    let { courseId } = req.params;

    let course = await Course.findByPk(courseId, {
      include: { all: true },
    });
    if (!course)
      return res.status(404).json({
        message: "Course not available or may be deleted",
      });

    await Course.increment(
      { reviews: 1 },
      {
        where: {
          id: courseId,
        },
      }
    );

    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting course details",
    });
  }
};

/**
 * User Get Search Published Courses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const searchPublishedCourses = async (req, res) => {
  try {
    let { q: searchQuery } = req.query;
    searchQuery += "%";

    let courses = await Course.findAll({
      where: Sequelize.and(
        { isPublished: true },
        Sequelize.or(
          {
            title: {
              [Op.iLike]: searchQuery,
            },
          },
          {
            description: {
              [Op.iLike]: searchQuery,
            },
          }
        )
      ),
      include: { all: true },
    });
    if (courses.length < 1)
      return res.status(404).json({
        message: "No result found",
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error searching courses",
    });
  }
};
/**
 * User Get Search Published Courses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const searchMyCourses = async (req, res) => {
  try {
    let { id } = req.user;
    let { q: searchQuery } = req.query;
    searchQuery += "%";

    let user = await User.findByPk(id, {
      include: { all: true },
    });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    let courses = await user.getCourses({
      where: Sequelize.and(
        { isPublished: true },
        Sequelize.or(
          {
            title: {
              [Op.iLike]: searchQuery,
            },
          },
          {
            description: {
              [Op.iLike]: searchQuery,
            },
          }
        )
      ),
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "No result found",
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error searching courses",
    });
  }
};

/**
 * User Get My Courses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getMyCourses = async (req, res) => {
  try {
    let { id } = req.user;
    let user = await User.findByPk(id, {
      include: { all: true },
    });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    if (user.courses.length < 1)
      return res.status(404).json({
        message: "You haven't subscribed for any course yet",
      });

    res.status(200).json(
      await user.getCourses({
        include: { all: true },
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};

export const addFreeCourseToMyCourses = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course)
      return res.status(404).json({
        message: "Course not found",
      });
    if (course.isPaid)
      return res.status(402).json({
        message: "This courses is paid, Pay for this course to access it",
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    await user.addCourse(course);

    res.status(200).json({
      message: "Successfully added course to your courses",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: "Error adding course to your courses",
    });
  }
};
