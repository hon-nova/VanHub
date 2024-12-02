import passport from 'passport'

import { PassportStrategy } from '../shared/interfaces/index'

export default class PassportConfig {
   constructor(strategies: PassportStrategy[]){
      this.addStrategies(strategies)
   }
   addStrategies(strategies: PassportStrategy[]):void {
      strategies.forEach((passportStrategy: PassportStrategy)=>{
         passport.use(passportStrategy.name, passportStrategy.strategy)
      })
   }
}