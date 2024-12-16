import Course from "../../models/Course.js";
import { Op, Sequelize } from "sequelize";
import Topic from "../../models/Topic.js";
import { put, del } from "@vercel/blob";

/**
 * Admin create course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

export const createCourse = async (req, res) => {
  try {
    let { buffer, mimetype } = req.file;
    let { title, description, price, category, duration } = req.body;

    const { url } = await put(`/thumbnails/thumbnail`, buffer, {
      contentType: mimetype,
      access: "public",
    });

    let course = await Course.create({
      title,
      description,
      price,
      category,
      duration,
      thumbnail: url,
    });

    if (!course) {
      //
      return res.status(401).json({
        message: "Error creating course",
      });
    }

    res.status(201).json({
      message: "Course created successfully",
    });
  } catch (error) {
    //
    console.log(error);
    res.status(500).json({
      message: "Error creating course",
    });
  }
};

/**
 * Upload course video url and uploading using vercel/blob/client
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const uploadCourseVideoUrl = async (req, res) => {
  try {
    let { url } = req.body;
    let { courseId } = req.params;

    let course = await Course.findByPk(courseId);

    if (!course)
      return res.status(404).json({
        message: "Course not found",
      });

    course.update("thumbnailVideo", url);

    res.json({
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading course video url",
    });
  }
};

/**
 * Admin search all course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const searchAllCourses = async (req, res) => {
  try {
    let { q: searchQuery } = req.query;
    searchQuery += "%";

    let courses = await Course.findAll({
      where: Sequelize.or(
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
      ),
      include: { all: true },
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "No result found for " + req.query.q,
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
 * Admin get all course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllCourse = async (req, res) => {
  try {
    let courses = await Course.findAll({
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
 * Admin search all course by category controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;

    let courses = await Course.findAll({
      where: {
        category,
      },
      include: { all: true },
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "No course found under this category",
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};

/**
 * Admin edit course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const editCourse = async (req, res) => {
  try {
    let path;
    let { courseId } = req.params;
    let { title, description, price, category, duration } = req.body;

    let course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not available or may be deleted",
      });
    }

    if (req.file) {
      await del(course.thumbnail);

      const { buffer, mimetype } = req.file;
      path = await put(`/thumbnails/thumbnail`, buffer, {
        contentType: mimetype,
        access: "public",
      });

      path = path.url;
    } else {
      path = course.thumbnail;
    }

    course.update({
      title,
      description,
      price,
      category,
      duration,
      thumbnail: path,
    });

    if (!course) {
      return res.status(401).json({
        message: "Error editing course",
      });
    }

    res.status(200).json({
      message: "Course edited successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error editing course",
    });
  }
};

/**
 * Admin delete course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteCourse = async (req, res) => {
  try {
    let { courseId } = req.params;

    const topics = await Topic.findAll({
      where: {
        courseId,
      },
    });

    topics.forEach(async (topic) => {
      await del(topic.video);
    });

    let course = await Course.findByPk(courseId);

    if (!course)
      return res.status(401).json({
        message: "Course not found",
      });

    let { thumbnail } = course;
    await course.destroy({ force: true });
    await del(thumbnail);

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting course",
    });
  }
};

/**
 * Admin publish course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const publishCourse = async (req, res) => {
  try {
    let { courseId } = req.params;
    let [affectRows] = await Course.update(
      {
        isPublished: true,
      },
      {
        where: {
          id: courseId,
        },
      }
    );

    if (affectRows === 0)
      return res.status(401).json({
        message: "Error publishing course",
      });

    res.status(200).json({
      message: "Course is now been published",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error publishing course",
    });
  }
};

/**
 * Admin unpublish course controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const unpublishCourse = async (req, res) => {
  try {
    let { courseId } = req.params;
    let [affectRows] = await Course.update(
      {
        isPublished: false,
      },
      {
        where: {
          id: courseId,
        },
      }
    );

    if (affectRows === 0)
      return res.status(401).json({
        message: "Error unpublishing course",
      });

    res.status(200).json({
      message: "Course is now been unpublished",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error unpublishing course",
    });
  }
};
