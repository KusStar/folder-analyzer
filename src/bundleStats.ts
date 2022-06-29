
export class BundleStats {
  static DEFAULT_STATS = {
    "children": [
      {
        "assets": [
          {
            "name": "",
            "size": 0,
            "chunks": [
              0
            ]
          }
        ],
        "chunks": [
          {
            "modules": []
          }
        ]
      }
    ]
  }
  statsJSON: typeof BundleStats.DEFAULT_STATS
  totalSize = 0
  idx = 0

  constructor(statsJSON = BundleStats.DEFAULT_STATS) {
    this.statsJSON = statsJSON
  }

  pushModule = (module: {
    name: string,
    size: number,
  }) => {
    this.statsJSON.children[0].chunks[0].modules.push({
      ...module,
      chunks: [
        0
      ],
      id: this.idx++
    })
    this.totalSize += module.size
  }

  setInfo = (info: { name: string, size: number }) => {
    this.statsJSON.children[0].assets[0].name = info.name
    this.statsJSON.children[0].assets[0].size = info.size
  }

  clean = () => {
    this.statsJSON.children[0].chunks[0].modules = []
    this.totalSize = 0
  }
}

