import { unlink } from "fs";
import { db } from "../../util/util.js";

export const createCourse = async (req, res) => {
  try {
    let { path } = req.file;
    let { title, description, price, category } = req.body;

    path = path.replace("public\\", "");

    let query = `
    INSERT INTO courses (title, description, thumbnail, price, category, id) VALUES ($1, $2, $3, $4, gen_random_uuid())
    `;
    let values = [title, description, path, price, category];
    let result = await db.query(query, values);

    if (result.rowCount < 1) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error creating course",
      });
    }

    res.status(200).json({
      message: "Course created successfully",
    });
  } catch (error) {
    if (req.file) unlink(req.file.path, (err) => err && console.log(err));
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

    let query = `SELECT * FROM courses WHERE title LIKE $1 OR description LIKE $1;`;
    let values = [searchQuery];
    let result = await db.query(query, values);

    if (result.rows.length < 1)
      return res.status(404).json({
        message: "No result found for " + req.query.q,
      });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error searching courses",
    });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    let query = `SELECT * FROM courses`;
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

export const getAllCourseByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    let query = `SELECT * FROM courses WHERE category = $1`;
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

export const createTopic = async (req, res) => {
  try {
    let { path } = req.file;
    let { courseId } = req.params;
    let { title, note, description } = req.body;

    path = path.replace("public\\", "");

    let query = `
    INSERT INTO topics (title, note, description, video, courseid, id) VALUES ($1, $2, $3, $4, $5, gen_random_uuid())
    `;
    let values = [title, note, description, path, courseId];
    let result = await db.query(query, values);

    if (result.rowCount < 1) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error creating course",
      });
    }

    res.status(200).json({
      message: "Course created successfully",
    });
  } catch (error) {
    if (req.file) unlink(req.file.path, (err) => err && console.log(err));
    console.log(error);
    res.status(500).json({
      message:
        "Error creating course, This may be because you passed an invalid courseId",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    let path;
    let { courseId } = req.params;
    let { title, description, price, category } = req.body;

    let query = `SELECT * FROM courses WHERE id = $1`;
    let values = [courseId];
    let result = await db.query(query, values);
    let course = result.rows[0];
    if (!course) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(404).json({
        message: "Course not available or may be deleted",
      });
    }

    if (req.file) {
      ({ path } = req.file);
      path = path.replace("public\\", "");
      unlink("public\\" + course.thumbnail, (err) => err && console.log(err));
    } else {
      path = course.thumbnail;
    }

    query = `
    UPDATE courses SET title = $1, description = $2, price = $3, thumbnail = $4 category = $5,
    WHERE id = $6
    `;
    values = [title, description, price, path, category, courseId];
    result = await db.query(query, values);

    if (result.rowCount < 1) {
      if (req.file) unlink(req.file.path, (err) => err && console.log(err));
      return res.status(401).json({
        message: "Error editing course",
      });
    }

    res.status(200).json({
      message: "Course edited successfully",
    });
  } catch (error) {
    if (req.file) unlink(req.file.path, (err) => err && console.log(err));
    console.log(error);
    res.status(500).json({
      message: "Error editing course",
    });
  }
};

export const editTopic = async (req, res) => {
  try {
    let path;
    let { courseId, topicId } = req.params;
    let { title, note, description } = req.body;

    let query = `SELECT * FROM topics WHERE id = $1 AND courseid = $2`;
    let values = [topicId, courseId];
    let result = await db.query(query, values);
    let topic = result.rows[0];
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

    query = `
    UPDATE topics SET title = $1, description = $2, note = $3, video = $4
    WHERE id = $5
    `;
    values = [title, description, note, path, topicId];
    result = await db.query(query, values);

    if (result.rowCount < 1) {
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
    let query = `SELECT video FROM topics WHERE courseid = $1
    `;
    let values = [courseId];
    let result = await db.query(query, values);

    result.rows.forEach((topic) => {
      unlink("public\\" + topic.video, (err) => err && console.log(err));
    });

    query = `DELETE FROM courses WHERE id = $1
    RETURNING thumbnail
    `;
    values = [courseId];
    result = await db.query(query, values);

    let { thumbnail } = result.rows[0];
    unlink("public\\" + thumbnail, (err) => err && console.log(err));

    if (result.rowCount < 1)
      return res.status(401).json({
        message: "Error deleting course",
      });

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
    let { courseId, topicId } = req.params;
    let query = `DELETE FROM topics WHERE id = $1 AND courseid = $2
    RETURNING video
    `;
    let values = [topicId, courseId];
    let result = await db.query(query, values);

    let { video } = result.rows[0];
    unlink("public\\" + video, (err) => err && console.log(err));

    if (result.rowCount < 1)
      return res.status(401).json({
        message: "Error deleting topic",
      });

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
    let query = `UPDATE courses SET ispublic = true WHERE id = $1`;
    let values = [courseId];
    let result = await db.query(query, values);

    if (result.rowCount < 1)
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
    let query = `UPDATE courses SET ispublic = false WHERE id = $1`;
    let values = [courseId];
    let result = await db.query(query, values);

    if (result.rowCount < 1)
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
