import { Menu, MenuTree } from '../types/entity'

export interface Tree {
  id: number
  label: string
  children?: Tree[]
}

/**
 * 过滤菜单树
 * @param menus 所有菜单树信息
 * @param parent_id 父ID
 */
export const filterMenuTree = (
  menus: MenuTree[],
  parent_id: number
): Tree[] => {
  const data: Tree[] = []
  menus
    .filter((item) => item.parent_id === parent_id)
    .forEach((item) => {
      data.push({
        id: item.menu_id as number,
        label: item.menu_title as string,
        children: item.children
          ? filterMenuTree(item.children, item.menu_id as number)
          : []
      })
    })
  return data
}

/**
 * 过滤用户菜单ID
 * @param menus 用户菜单信息
 */
export const filterMenuKey = (menus: Menu[]): number[] => {
  const data: number[] = []
  const sub_id: number[] = menus
    .filter((item) => item.is_sub)
    .map((item) => Number(item.menu_id))
  const result1: number[] = menus
    .filter((item) => sub_id.includes(Number(item.parent_id)))
    .map((item) => Number(item.menu_id))
  const result2: number[] = menus
    .filter((item) => !item.is_sub)
    .map((item) => Number(item.menu_id))
  data.push(...result1.concat(result2))
  return Array.from(new Set(data))
}
