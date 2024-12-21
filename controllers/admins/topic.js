import Topic from "../../models/Topic.js";
import { put, del } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

/**
 * Admin create topic controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createTopic = async (req, res) => {
  try {
    let { courseId } = req.params;
    let { title, note, description } = req.body;

    const topic = await Topic.create({
      title,
      note,
      description,
      courseId: courseId,
    });

    if (!topic) {
      return res.status(401).json({
        message: "Error creating topic",
      });
    }

    res.status(201).json({
      message: "Topic created successfully",
      topicId: topic.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error creating topic, This may be because you passed an invalid courseId",
    });
  }
};

/**
 * Upload topic video url and uploading using vercel/blob/client
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const uploadTopicVideoUrl = async (req, res) => {
  try {
    let { url } = req.body;
    let { topicId } = req.params;

    let topic = await Topic.findByPk(topicId);

    if (!topic)
      return res.status(404).json({
        message: "Topic not found",
      });

    topic.update("video", url);

    res.json({
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading topic video url",
    });
  }
};

/**
 * Admin edit topic controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const editTopic = async (req, res) => {
  try {
    let path;
    let { topicId } = req.params;
    let { title, note, description } = req.body;

    let topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({
        message: "Topic not available or may be deleted",
      });
    }

    if (req.file) {
      await del(topic.video);

      const { buffer, mimetype } = req.file;
      path = await put(`/videos/video`, buffer, {
        contentType: mimetype,
        access: "public",
      });

      path = path.url;
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
      return res.status(401).json({
        message: "Error editing topic",
      });
    }

    res.status(200).json({
      message: "Topic edited successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error editing topic",
    });
  }
};

/**
 * Admin delete topic controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteTopic = async (req, res) => {
  try {
    let { topicId } = req.params;

    let topic = await Topic.findByPk(topicId);

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
