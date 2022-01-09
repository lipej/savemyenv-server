declare module '@ioc:Adonis/Core/Hash' {
  interface HashersList {
    bcrypt: {
      config: BcryptConfig
      implementation: BcryptContract
    }
  }
}
