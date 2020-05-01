# E-learning - Make your website an e-learning platform
![E-learning banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/elearning-banner.png)

## Introduction

The plugin provides the functionality of managing courses and lessons in the OctoberCMS.

Key features:
1. Add and remove courses
1. Link related courses (similar, one course required by another or a course can be watched after watching another one)
1. Reordering courses
1. Schedule publication of lesson and courses
1. Add and remove lessons
1. Link related lessons (similar lesson, one lesson required by another or a lesson can be watched after watching another one)
1. Reordering lessons using "number in course" parameter which will push other lessons if set to lower
1. Navigating through courses and lessons using easy to understand the logic of four components
1. Skipping through lessons in the course
1. Protect videos from being downloaded (described in `Protected videos` section)

![Lesson view](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/screenshot4.png)

The plugin uses the awesome [Video JS](https://videojs.com/) player by default.

[//]: # (Documentation)

## Course
Courses are designed to be containers for the lessons.

![Create course](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/screenshot2.png)

Duration and difficulty are optional parameters that can be used in views to better organize the structure of the course.

![Course list](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/course-list.png)

Courses can be reordered using simple reorder behavior.

## Lesson
![Update lesson](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/screenshot1.png)

Every lesson can have a `number_in_course` parameter set. By default, it is set to the last position of the course after selecting the course. If you decide to make it earlier one add the number

> **Right now lessons have to have incremented numbers for the `number_in_course`. `next_lesson` and `previous_lesson` will not work if the numbers are not one after the other**

### Materials
Lessons can keep a variety of material types.

1. Video from media (which can be protected as described below),
1. Slideshow created from PDF attachment,
1. Slideshow created from uploaded images,
1. Embedded video (like videos from YouTube or Vimeo),
1. Other attachments

## Related courses and lessons
Lessons can have related lessons and courses can have related courses. The idea here is to link lessons and courses logically, not only by the order in the course.

There are three relations right now (more can be added on demand):
1. `similar`
1. `before`
1. `after`

Let's say we are talking in one lesson about the lesson in a different course that concerns a similar topic. We can link those two lessons using `similar` relation.

If we consider one lesson as a requirement to understand the second one, we can link those two using `before` and `after`. `before` is treated as a requirement for the current lesson/course.

![Related lesson](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/screenshot3.png)

## `is_enabled` and `published_at`
Marking the course and lesson as enabled will not make it published if the `published_at` parameter is set in the future.

Enabling is meant to be used when we want to hide courses and lessons (for example when we are working on them like drafts). Using the date of publication we can schedule the publication of the lesson or course in the future.

## How-to

The plugin provides such components:

### `CourseList`
Just a simple list of courses with links to go to the single-course page.

### `CourseDetails`
This component will inject the `course` variable to the page which is a representation of the model in the database. The course is eagerly loaded with its lessons and similar courses.

### `LessonList`
It provides a list of the lessons. The component can operate in two modes. It's `small` and `full`. By default it's full. `Full` mode is designed to be a listing of the lessons on the page. The `small` one is meant to be used on the single-lesson page to navigate through the other lessons in the course.

The small one by default is rendered as a scrollable list with an automatically scrolled place to the lesson that is marked as current (using lesson embed to the page).

### `LessonDetails`
Lesson details is the counterpart of `CourseDetails`. It injects the `Lesson` model object to the page.

It will also inject `Video JS` assets to the page and ensures the video is protected (as described in the Protected videos section).

![Lesson view](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/elearning/assets/images/screenshot4.png)

## Config

### Courses dir
`coursesDir` property tells the `Course` model where the lessons are stored. It is not a requirement to keep videos there but the plugin is created in such a way that in the `coursesDir` directories named as course slugs will be created.

### Protected videos
By default, the videos from the lessons are "protected". If you want to make your videos easier to download, disable the `protectVideos` config.

The protection is just a process that will slow down the users to download the video. If you want to be sure it's protected consider using DRM or any similar technology.

To access the lessons, there's a custom routing defined in the plugin that checks if there's a "password" in the user's session. The password is generated by the `LessonDetails` component in the `onRun` method. After the route is hit, the password from the session is pulled, which makes the download of the video possible only one time.

The javascript in the `LessonDetails` component is made in such a way, that it will automatically start downloading the video on document load.

> **If you want to be sure that nobody will download the video through public URL, you have to tweak the .htaccess to fulfill your needs.**

## Possible future features
* Starting video from the point that user stopped watching
* Integration with Cumulus to make complete e-learning platform for schools
* Add streaming features for remote lessons
* Add exams