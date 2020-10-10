import * as express from 'express'
import * as passport from 'passport'
import { Strategy } from 'passport-github2'
import { User } from '../entities/user'

passport.use(
  'github',
  new Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/auth/github/callback'
          : '',
      scope: ['user', 'repo'],
    },
    (accessToken: any, refreshToken: any, profile: any, cb: any) => {
      User.findOne({ where: { username: profile.username } }).then((user) => {
        if (!user) {
          return User.create({
            username: profile.username,
            avatar_url: profile.photos![0].value,
          })
            .save()
            .then((user) => {
              cb(null, {
                accessToken,
                user,
              })
            })
        }

        return cb(null, {
          accessToken,
          user,
        })
      })
    },
  ),
)

passport.serializeUser((u, cb) => cb(null, JSON.stringify(u)))
passport.deserializeUser((u, cb) => cb(null, JSON.parse(u as string)))

export const handleGitHubCallback = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  passport.authenticate('github', (err, user) => {
    if (err) {
      return res.json({
        message: 'Error while authenticating',
        status: 400,
      })
    }

    req.login(user, () => {
      if (process.env.NODE_ENV === 'development') {
        res.redirect('http://localhost:3000')
      } else {
        res.redirect('/')
      }
    })
  })(req, res, next)
}
