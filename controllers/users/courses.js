import { Op, Sequelize } from "sequelize";
import Course from "../../models/Course.js";
import Topic from "../../models/Topic.js";

export const getAllPublishedCourse = async (req, res) => {
  try {
    let courses = await Course.findAll({
      where: {
        isPublished: true,
      },
      include: { model: Topic },
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

export const getAllPublishedCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    let courses = await Course.findAll({
      where: {
        isPublished: true,
        category,
      },
      include: { model: Topic },
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

export const getCourseByID = async (req, res) => {
  try {
    let { courseId } = req.params;

    let course = await Course.findByPk(courseId, {
      include: { model: Topic },
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

export const getCourseTopics = async (req, res) => {
  try {
    let { courseId } = req.params;
    let topics = await Topic.findAll({
      where: {
        courseId,
      },
      include: { model: Course, as: "course" },
    });

    if (topics.length < 1)
      return res.status(404).json({
        message: "No topic available under this course",
      });

    res.status(200).json(topics);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting topics",
    });
  }
};

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
      include: { model: Topic },
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

export const getTopicByID = async (req, res) => {
  try {
    let { topicId } = req.params;

    let topic = Topic.findByPk(topicId, {
      include: { model: Course },
    });
    if (!topic)
      return res.status(404).json({
        message: "Topic not available or may be deleted",
      });

    res.status(200).json(topic);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting topic details",
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    let { id } = req.user;

    let courses = await Course.findAll({
      include: { model: Topic },
    });
    if (courses.length < 1)
      return res.status(404).json({
        message: "You haven't enrolled to any course.",
      });

    let subscribers = [];

    courses.forEach((course) => {
      subscribers = [...subscribers, ...course.subscribers, id];
    });

    courses = await Course.findAll({
      where: {
        subscribers,
      },
    });

    if (courses.length < 1)
      return res.status(404).json({
        message: "You haven't enrolled to any course.",
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};
