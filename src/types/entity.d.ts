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

export interface Role extends Base {
  role_id?: number
  role_name?: string
  role_code?: string
  is_status?: boolean
  description?: string
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
  time?: number
  description?: string
}
