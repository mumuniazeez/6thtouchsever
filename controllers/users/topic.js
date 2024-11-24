import Topic from "../../models/Topic.js"

/**
 * User Get Topics Under a Course
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getCourseTopics = async (req, res) => {
  try {
    let { courseId } = req.params;
    let topics = await Topic.findAll({
      where: {
        courseId,
      },
      include: { all: true },
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

/**
 * User Get Topics By Id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTopicByID = async (req, res) => {
  try {
    let { topicId } = req.params;

    let topic = Topic.findByPk(topicId, {
      include: { all: true },
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