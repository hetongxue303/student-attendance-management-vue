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
}

export interface QueryRole extends Page {
  role_name?: string
}

export interface QueryMenu extends Page {
  menu_title?: string
}
