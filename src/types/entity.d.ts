interface Base {
  create_time?: Date
  update_time?: Date
}

export interface ILogin {
  username: string
  password: string
  code: string
  rememberMe: boolean
}

export interface College extends Base {
  college_id?: number
  college_name?: string
  description?: string
}

export interface Major extends Base {
  major_id?: number
  college_id?: number
  college?: College
  major_name?: string
  description?: string
}

export interface Classes extends Base {
  classes_id?: number
  major_id?: number
  major?: Major
  classes_name?: string
  college_id?: number
  college?: College
  description?: string
}

export interface User extends Base {
  user_id?: number
  username?: string
  password?: string
  real_name?: string
  gender?: number
  is_status?: boolean
  description?: string
  classes_id?: number
  classes?: Classes
}

export interface BOUser extends User {
  role_id?: number
}

export interface Role extends Base {
  role_id?: number
  role_name?: string
  role_code?: string
  is_status?: boolean
  description?: string
}

export interface BORole {
  role?: Role
  menu_ids?: number[]
}

export interface Menu extends Base {
  menu_id?: number
  parent_id?: number
  menu_title?: string
  menu_type?: number
  router_name?: string
  router_path?: string
  component?: string
  sort?: number
  icon?: string
  permission?: string
  sub_count?: number
  is_show?: boolean
  is_sub?: boolean
  is_status?: boolean
  description?: string
}

export interface MenuTree extends Menu {
  children?: MenuTree[]
}

export interface Course extends Base {
  course_id?: number
  course_name?: string
  college_id?: number
  college?: College
  major_id?: number
  major?: Major
  classes_id?: number
  classes?: Classes
  count?: number
  selection?: number
  time?: number
  description?: string
}

export interface BOCourse extends Course {
  user_id?: number
}

export interface MyCourse extends Course {
  checked_in?: number // 已签到次数
  teacher_name?: string
  status?: number
}

export interface Attendance extends Base {
  attendance_id?: number
  user_id?: number
  user?: User
  course_id?: number
  course?: Course
  attendance_time?: Date
  time?: number
}

export interface Check extends Base {
  check_id?: number
  user_id?: number
  user?: User
  course_id?: number
  course?: Course
  attendance_id?: number
  attendance?: Attendance
  check_time?: Date
}

export interface Choice extends Base {
  choice_id?: number
  user_id?: number
  user?: User
  course_id?: number
  course?: Course
  choice_status?: number
}

export interface VOChoice {
  ids?: number[]
  choice_status?: number
}
