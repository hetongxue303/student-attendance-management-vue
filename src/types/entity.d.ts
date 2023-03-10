interface Base {
  create_time?: Date
  update_time?: Date
}

export interface UserEntity extends Base {
  user_id?: number
  username?: string
  password?: string
  real_name?: string
  gender?: string
  is_status?: boolean
  description?: string
}

export interface RoleEntity extends Base {
  role_id?: number
  role_name?: string
  is_status?: boolean
  description?: string
}

export interface MenuEntity extends Base {
  menu_id?: number
  parent_id?: number
  menu_title?: string
  menu_type?: string
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
  is_delete?: boolean
  description?: string
}

export interface MenuInfoDto {
  role?: MenuEntity
  menu_ids?: number[]
}

export interface MenuTreeDto extends MenuEntity {
  children?: MenuTreeDto[]
}
