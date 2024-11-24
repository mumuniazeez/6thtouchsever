import { Op, Sequelize } from "sequelize";
import Course from "../../models/Course.js";
import User from "../../models/User.js";

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

    res.status(200).json(user.courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};
