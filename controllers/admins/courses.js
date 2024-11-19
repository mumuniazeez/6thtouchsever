import Courses from "../../models/courses.js";
import { unlink } from "fs";
import { Op, Sequelize } from "sequelize";
import Topics from "../../models/topics.js";
import { put, del } from "@vercel/blob";

export const createCourse = async (req, res) => {
  try {
    let { buffer, mimetype } = req.file;
    let { title, description, price, category, duration } = req.body;

    const { url } = await put(`/thumbnails/thumbnail`, buffer, {
      contentType: mimetype,
      access: "public",
    });

    let course = await Courses.create({
      title,
      description,
      price,
      category,
      duration,
      thumbnail: url,
    });

    if (!course) {
      // if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error creating course",
      });
    }

    res.status(201).json({
      message: "Course created successfully",
    });
  } catch (error) {
    // if (req.file) unlink(req.file.path, (err) => err && console.log(err));
    console.log(error);
    res.status(500).json({
      message: "Error creating course",
    });
  }
};

export const searchAllCourses = async (req, res) => {
  try {
    let { q: searchQuery } = req.query;
    searchQuery += "%";

    let courses = await Courses.findAll({
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
      include: { model: Topics, as: "topics" },
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

export const getAllCourse = async (req, res) => {
  try {
    let courses = await Courses.findAll({
      include: { model: Topics, as: "topics" },
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

export const getAllCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;

    let courses = await Courses.findAll({
      where: {
        category,
      },
      include: { model: Topics, as: "topics" },
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

export const createTopic = async (req, res) => {
  try {
    let { path } = req.file;
    let { courseId } = req.params;
    let { title, note, description } = req.body;

    path = path.replace("public\\", "");

    const topic = await Topics.create({
      title,
      note,
      description,
      courseId,
      video: path,
    });

    await topic.save();

    if (!topic) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error creating topic",
      });
    }

    res.status(200).json({
      message: "Topic created successfully",
    });
  } catch (error) {
    if (req.file) unlink(req.file.path, (err) => err && console.log(err));
    console.log(error);
    res.status(500).json({
      message:
        "Error creating topic, This may be because you passed an invalid courseId",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    let path;
    let { courseId } = req.params;
    let { title, description, price, category } = req.body;

    let course = await Courses.findByPk(courseId);
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

export const editTopic = async (req, res) => {
  try {
    let path;
    let { topicId } = req.params;
    let { title, note, description } = req.body;

    let topic = await Topics.findByPk(topicId);
    if (!topic) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(404).json({
        message: "Topic not available or may be deleted",
      });
    }

    if (req.file) {
      ({ path } = req.file);
      path = path.replace("public\\", "");
      unlink("public\\" + topic.video, (err) => err && console.log(err));
    } else {
      path = topic.video;
    }

    topic.update({
      title,
      description,
      note,
      video: path,
    });

    if (topic.isNewRecord) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error editing topic",
      });
    }

    res.status(200).json({
      message: "Topic edited successfully",
    });
  } catch (error) {
    if (req.file) unlink(req.file.path, (err) => err && console.log(err));
    console.log(error);
    res.status(500).json({
      message: "Error editing topic",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    let { courseId } = req.params;

    const topics = await Topics.findAll({
      where: {
        courseId,
      },
    });

    topics.forEach(async (topic) => {
      await del(topic.video);
    });

    let course = await Courses.findByPk(courseId);

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

export const deleteTopic = async (req, res) => {
  try {
    let { topicId } = req.params;

    let topic = await Topics.findByPk(topicId);

    if (!topic)
      return res.status(404).json({
        message: "Topic not found",
      });

    let { video } = topic;
    await topic.destroy({ force: true });
    await del(video);

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting topic",
    });
  }
};

export const publishCourse = async (req, res) => {
  try {
    let { courseId } = req.params;
    let [affectRows] = await Courses.update(
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

export const unpublishCourse = async (req, res) => {
  try {
    let { courseId } = req.params;
    let [affectRows] = await Courses.update(
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
