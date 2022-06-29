
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
  ratio = 1

  constructor(statsJSON = BundleStats.DEFAULT_STATS) {
    this.statsJSON = statsJSON
  }

  pushModule = (item: {
    name: string,
    size: number,
  }) => {
    item.size = item.size * this.ratio
    this.statsJSON.children[0].chunks[0].modules.push({
      ...item,
      chunks: [
        0
      ],
      id: this.idx++
    })
    this.totalSize += item.size
  }

  setInfo = (info: { name: string, size: number }) => {
    // Must have .js postfix
    this.statsJSON.children[0].assets[0].name = info.name + '.js'
    this.statsJSON.children[0].assets[0].size = info.size
  }

  clean = () => {
    this.statsJSON.children[0].chunks[0].modules = []
    this.totalSize = 0
  }
}

