#!/usr/bin/env node

import * as meow from 'meow'
import { verifyLinks } from './index'

const cli = meow(`
    Usage
      $ dont-use-here-link <folder>
    Examples
      $ dont-user-here-link ./blog
`)

verifyLinks(cli.input[0]).catch(() => {})
