import React from 'react';
import { courseData } from './courseData';
import type { Course, CourseSectionData } from './courseData';
import Learning from './Learning';

const getCardStyles = (type: Course['type']) => {
  switch (type) {
    case 'video':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-500',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-500',
        tagColor: 'bg-red-500',
      };
    case 'book':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-500',
        borderColor: 'border-blue-200',
        iconBg: 'bg-blue-500',
        tagColor: 'bg-blue-500',
      };
    case 'course':
    default:
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-500',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-500',
        tagColor: 'bg-green-500',
      };
  }
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex-shrink-0">
        <img src={course.icon} alt={course.title} className="w-24 h-32 object-cover rounded" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 text-md">{course.subtitle}</h3>
          <span className="text-sm text-gray-400 whitespace-nowrap">{course.articleCount}篇文章</span>
        </div>
        <p className="text-gray-500 text-sm mt-1 mb-3">{course.description}</p>
        <div className="space-y-2">
          {course.trials.map((trial, index) => (
            <a key={index} href={trial.link} className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
              <span className="text-green-500 border border-green-200 bg-green-50 rounded-sm text-xs px-1 py-0.5 mr-2">试读</span>
              {trial.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseSection: React.FC<{ section: CourseSectionData }> = ({ section }) => {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {section.courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {courseData.map((section) => (
          <CourseSection key={section.id} section={section} />
        ))}
        <Learning />
      </div>
    </div>
  );
};

export default CoursesPage;
