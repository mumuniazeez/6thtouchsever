import { db } from "../util/util.js";

export const getAllPublicCourse = async (req, res) => {
  try {
    let query = `SELECT * FROM courses WHERE ispublic = true`;
    let result = await db.query(query);

    if (result.rows.length < 1)
      return res.status(404).json({
        message: "No course available",
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};

export const getAllPublicCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    let query = `SELECT * FROM courses WHERE ispublic = true AND category = $1`;
    let values = [category];
    let result = await db.query(query, values);

    if (result.rows.length < 1)
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

export const getCourseByID = async (req, res) => {
  try {
    let { courseId } = req.params;

    let query = `SELECT * FROM courses WHERE id = $1`;
    let values = [courseId];
    let result = await db.query(query, values);
    let course = result.rows[0];
    if (!course)
      return res.status(404).json({
        message: "Course not available or may be deleted",
      });

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
    let query = `SELECT * FROM topics WHERE courseid = $1`;
    let values = [courseId];
    let result = await db.query(query, values);

    if (result.rows.length < 1)
      return res.status(404).json({
        message: "No topic available under this course",
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting topics",
    });
  }
};

export const searchPublicCourses = async (req, res) => {
  try {
    let { q: searchQuery } = req.query;
    searchQuery += "%";

    let query = `SELECT * FROM courses WHERE ispublic = true AND (title LIKE $1 OR description LIKE $1);`;
    let values = [searchQuery];
    let result = await db.query(query, values);

    if (result.rows.length < 1)
      return res.status(404).json({
        message: "No result found",
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error searching courses",
    });
  }
};

export const getTopicByID = async (req, res) => {
  try {
    let { courseId, topicId } = req.params;

    let query = `SELECT * FROM topics WHERE id = $1 AND courseid = $2`;
    let values = [topicId, courseId];
    let result = await db.query(query, values);
    let course = result.rows[0];
    if (!course)
      return res.status(404).json({
        message: "Topic not available or may be deleted",
      });

    res.status(200).json(course);
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
    let query = `
      SELECT * FROM courses
      WHERE $1 = ANY(subscribers)
      `;
    let values = [id];
    let result = await db.query(query, values);

    if (result.rows.length < 1)
      return res.status(404).json({
        message: "You haven't enrolled to any course.",
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting courses",
    });
  }
};
