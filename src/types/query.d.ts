interface Page {
  page: number
  size: number
}

export interface QueryCollege extends Page {
  college_name?: string
}

export interface QueryMajor extends Page {
  major_name?: string
}

export interface QueryClasses extends Page {
  classes_name?: string
}

export interface QueryUser extends Page {
  real_name?: string
  username?: string
  attendance_id?: number
  status?: boolean
}

export interface QueryRole extends Page {
  role_name?: string
}

export interface QueryMenu extends Page {
  menu_title?: string
}

export interface QueryMenuTree {}

export interface QueryCourse extends Page {
  course_name?: string
}

export interface QueryCourseMe extends QueryCourse {
  username?: string
  course_id?: number
}

export interface QueryCheck extends Page {
  real_name?: string
}

export interface QueryAttendance extends Page {
  status?: number
}

export interface QueryChoice extends Page {
  course_name?: string
}
