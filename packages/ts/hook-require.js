'use strict'

// @ts-check

const path = require('path')
const { createConfig } = require('@packages/snapshot')
const env = process.env.CYPRESS_INTERNAL_ENV === 'production' ? 'prod' : 'dev'
const config = createConfig(env)

process.env.PROJECT_BASE_DIR = process.env.PROJECT_BASE_DIR ?? path.join(__dirname, '..', '..')

const isDev = env === 'dev'

if (process.env.USE_SNAPSHOT != null) {
  runWithSnapshot()
} else if (process.env.USE_PACKHERD != null) {
  runWithoutSnapshot()
}

function runWithSnapshot () {
  const { snapshotRequire } = require('v8-snapshot/dist/loading/snapshot-require')
  const { projectBaseDir } = config

  snapshotRequire(projectBaseDir, {
    diagnostics: isDev,
    useCache: true,
    transpileOpts: {
      supportTS: isDev,
      initTranspileCache: isDev
        ? () => require('dirt-simple-file-cache').DirtSimpleFileCache.initSync(projectBaseDir, { keepInMemoryCache: true })
        : function () {},
      tsconfig: {
        compilerOptions: {
          useDefineForClassFields: false, // default
          importsNotUsedAsValues: 'remove', // default
        },
      },
    },

  })
}

function runWithoutSnapshot () {
  const { DirtSimpleFileCache } = require('dirt-simple-file-cache')
  const { packherdRequire } = require('packherd/dist/src/require.js')
  const { projectBaseDir } = config

  packherdRequire(projectBaseDir, {
    diagnostics: true,
    transpileOpts: {
      supportTS: true,
      initTranspileCache: DirtSimpleFileCache.initSync,
      tsconfig: {
        compilerOptions: {
          useDefineForClassFields: false, // default
          importsNotUsedAsValues: 'remove', // default
        },
      },
    },
  })
}
