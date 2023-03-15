import { App, ObjectDirective } from 'vue'
import { permission, role } from './permission'

const directives = { permission, role }
export default {
  install(app: App) {
    Object.keys(directives).forEach((directive: string) => {
      app.directive(
        directive,
        (directives as { [key: string]: ObjectDirective })[directive]
      )
    })
  }
}
