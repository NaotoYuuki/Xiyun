import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  // 世界路径信息
  世界路径: z.object({
    当前位置: z.string().prefault('未知地点'),
    天气: z.enum(['晴天', '多云', '阴天', '小雨', '大雨', '雷雨', '雪天', '雾天', '大风', '沙尘', '彩虹', '极光', '特殊']).prefault('晴天'),
    当前时间: z.string().describe('格式: HH:MM，24小时制').prefault('00:00'),
    具体时间段: z.enum(['凌晨', '清晨', '早上', '上午', '中午', '下午', '傍晚', '夜晚', '深夜', '午夜']).prefault('中午'),
    当前日期: z.object({
      年: z.coerce.number().prefault(2022),
      月: z.coerce.number().transform(value => _.clamp(value, 1, 12)).prefault(1),
      日: z.coerce.number().transform(value => _.clamp(value, 1, 31)).prefault(16),
      星期: z.enum(['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']).prefault('星期日')
    }).prefault({}),
    近期事务: z.string().prefault(''),
  }).prefault({}),

  // 人物档案系统
  人物档案: z.object({
    主人公: z.object({
      // 基础信息 - 简化版本
      基础信息: z.object({
        姓名: z.string().prefault(''),
        身高: z.coerce.number().transform(value => _.clamp(value, 100, 250)).describe('单位: 厘米').prefault(175),
        年龄: z.coerce.number().transform(value => _.clamp(value, 0, 120)).prefault(18),
        性别: z.enum(['男', '女', '其他']).prefault('男'),
        所属势力: z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族', '无']).prefault('无'),
        身份: z.string().prefault('')
      }).prefault({}),

      // 着装管理系统 - 简化版，去除时间字段
      着装管理: z.object({
        // 预设套装系统
        预设套装: z.record(
          z.string().describe('套装编号'),
          z.object({
            编号: z.coerce.number().prefault(0),
            名称: z.string().prefault(''),
            发型: z.string().prefault(''),
            发色: z.string().prefault(''),
            瞳色: z.string().prefault(''),
            上装: z.string().prefault(''),
            下装: z.string().prefault(''),
            鞋子: z.string().prefault(''),
            饰品: z.array(z.string()).prefault([]),
            描述: z.string().prefault(''),
            适用场合: z.array(z.string()).prefault([])
          }).prefault({})
        ).prefault({}),

        // 自由组合套装 - 使用特殊的编号-1表示
        自由套装: z.object({
          编号: z.literal(-1).prefault(-1),
          发型: z.string().prefault(''),
          发色: z.string().prefault(''),
          瞳色: z.string().prefault(''),
          上装: z.string().prefault(''),
          下装: z.string().prefault(''),
          鞋子: z.string().prefault(''),
          饰品: z.array(z.string()).prefault([]),
          备注: z.string().prefault('')
        }).prefault({}),

        // 当前着装变量
        当前着装编号: z.coerce.number().prefault(-1)
      }).prefault({}),

      // 人际关系
      人际关系: z.record(
        z.enum(['沐霂', '恬豆', '又一', '梨安', '璃子', '安梨', 'Y', '吉恩', 'C-Enter', '墨桃', '霜莲', '王恪', '缪斯', '凯若', '奈洛', '七号', '瑞恩', '辰瑞', '普林斯', '尼尔·万', '王刑统', '摩尔', '扎克']).describe('对方人物姓名'),
        z.string().describe('关系描述').prefault('')
      ).prefault({}),

      // 势力关系
      势力关系: z.record(
        z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族']).describe('势力名称'),
        z.string().describe('关系描述').prefault('')
      ).prefault({})
    }).prefault({}),

    可攻略人物: z.record(
      z.enum(['沐霂', '恬豆', '又一', '梨安', '璃子', '安梨', 'Y', '吉恩', 'C-Enter', '墨桃', '霜莲', '王恪', '缪斯', '凯若', '奈洛', '七号', '瑞恩']),
      z.object({
        // 基础信息
        基础信息: z.object({
          姓名: z.string().prefault(''),
          身高: z.coerce.number().transform(value => _.clamp(value, 100, 250)).describe('单位: 厘米').prefault(165),
          年龄: z.coerce.number().transform(value => _.clamp(value, 0, 120)).prefault(18),
          性别: z.enum(['男', '女', '其他']).prefault('女'),
          所属势力: z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族', '无']).prefault('无'),
          身份: z.string().prefault(''),
          假名: z.string().prefault(''),
          假身份: z.string().prefault(''),
          是否暴露身份: z.boolean().prefault(false),
          是否解锁: z.boolean().prefault(false)
        }).prefault({}),

        // 着装管理系统 - 内衣系统移动至此，与套装系统同级别
        着装管理: z.object({
          // 内衣系统 - 移动至着装管理下
          内衣: z.object({
            上着: z.string().prefault(''),
            下着: z.string().prefault('')
          }).prefault({}),

          // 预设套装系统
          预设套装: z.record(
            z.string().describe('套装编号'),
            z.object({
              编号: z.coerce.number().prefault(0),
              名称: z.string().prefault(''),
              发型: z.string().prefault(''),
              发色: z.string().prefault(''),
              瞳色: z.string().prefault(''),
              上装: z.string().prefault(''),
              下装: z.string().prefault(''),
              袜子: z.string().prefault(''),
              鞋子: z.string().prefault(''),
              饰品: z.array(z.string()).prefault([]),
              描述: z.string().prefault(''),
              适用场合: z.array(z.string()).prefault([])
            }).prefault({})
          ).prefault({}),

          // 自由组合套装
          自由套装: z.object({
            编号: z.literal(-1).prefault(-1),
            发型: z.string().prefault(''),
            发色: z.string().prefault(''),
            瞳色: z.string().prefault(''),
            上装: z.string().prefault(''),
            下装: z.string().prefault(''),
            袜子: z.string().prefault(''),
            鞋子: z.string().prefault(''),
            饰品: z.array(z.string()).prefault([]),
            备注: z.string().prefault('')
          }).prefault({}),

          // 当前着装变量
          当前着装编号: z.coerce.number().prefault(-1)
        }).prefault({}),

        // 人际关系
        人际关系: z.record(
          z.enum(['主人公', '沐霂', '恬豆', '又一', '梨安', '璃子', '安梨', 'Y', '吉恩', 'C-Enter', '墨桃', '霜莲', '王恪', '缪斯', '凯若', '奈洛', '七号', '瑞恩', '辰瑞', '普林斯', '尼尔·万', '王刑统', '摩尔', '扎克']).describe('对方人物姓名'),
          z.string().describe('关系描述').prefault('')
        ).prefault({}),

        // 势力关系
        势力关系: z.record(
          z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族']).describe('势力名称'),
          z.string().describe('关系描述').prefault('')
        ).prefault({}),

        // 告白状态
        告白状态: z.object({
          是否为恋人: z.boolean().prefault(false),
          关系确认日期: z.string().prefault('')
        }).prefault({}),

        // 关系数值
        关系数值: z.object({
          // 当前值
          好感度: z.coerce.number()
            .transform(value => _.clamp(value, -100, 100))
            .prefault(0),
          性欲度: z.coerce.number()
            .transform(value => _.clamp(value, 0, 100))
            .prefault(0),
          淫乱度: z.coerce.number()
            .transform(value => _.clamp(value, 0, 100))
            .prefault(0),

          // 变化值
          好感度变化量: z.coerce.number().prefault(0),
          性欲度变化量: z.coerce.number().prefault(0),
          淫乱度变化量: z.coerce.number().prefault(0),

          // 好感增加上限
          今日好感度增加: z.coerce.number()
            .transform(value => Math.max(0, value))
            .transform(value => Math.min(value, 10))
            .prefault(0)
        }).prefault({})
      }).prefault({})
    ).prefault({}),

    其他人物: z.record(
      z.enum(['辰瑞', '普林斯', '尼尔·万', '王刑统', '摩尔', '扎克']),
      z.object({
        // 基础信息
        基础信息: z.object({
          姓名: z.string().prefault(''),
          身高: z.coerce.number().transform(value => _.clamp(value, 100, 250)).describe('单位: 厘米').prefault(175),
          年龄: z.coerce.number().transform(value => _.clamp(value, 0, 120)).prefault(20),
          性别: z.enum(['男', '女', '其他']).prefault('男'),
          所属势力: z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族', '无']).prefault('无'),
          身份: z.string().prefault(''),
          假名: z.string().prefault(''),
          假身份: z.string().prefault(''),
          是否暴露身份: z.boolean().prefault(false),
          是否解锁: z.boolean().prefault(false)
        }).prefault({}),

        // 着装管理系统 - 简化版
        着装管理: z.object({
          // 预设套装系统
          预设套装: z.record(
            z.string().describe('套装编号'),
            z.object({
              编号: z.coerce.number().prefault(0),
              名称: z.string().prefault(''),
              发型: z.string().prefault(''),
              发色: z.string().prefault(''),
              瞳色: z.string().prefault(''),
              上装: z.string().prefault(''),
              下装: z.string().prefault(''),
              鞋子: z.string().prefault(''),
              饰品: z.array(z.string()).prefault([]),
              描述: z.string().prefault(''),
              适用场合: z.array(z.string()).prefault([])
            }).prefault({})
          ).prefault({}),

          // 自由组合套装
          自由套装: z.object({
            编号: z.literal(-1).prefault(-1),
            发型: z.string().prefault(''),
            发色: z.string().prefault(''),
            瞳色: z.string().prefault(''),
            上装: z.string().prefault(''),
            下装: z.string().prefault(''),
            鞋子: z.string().prefault(''),
            饰品: z.array(z.string()).prefault([]),
            备注: z.string().prefault('')
          }).prefault({}),

          // 当前着装变量
          当前着装编号: z.coerce.number().prefault(-1)
        }).prefault({}),

        // 人际关系
        人际关系: z.record(
          z.enum(['主人公', '沐霂', '恬豆', '又一', '梨安', '璃子', '安梨', 'Y', '吉恩', 'C-Enter', '墨桃', '霜莲', '王恪', '缪斯', '凯若', '奈洛', '七号', '瑞恩', '辰瑞', '普林斯', '尼尔·万', '王刑统', '摩尔', '扎克']).describe('对方人物姓名'),
          z.string().describe('关系描述').prefault('')
        ).prefault({}),

        // 势力关系
        势力关系: z.record(
          z.enum(['禧运楼', '卡德米亚重工', '维瑞异象对策局', '默歌学会', '王氏家族']).describe('势力名称'),
          z.string().describe('关系描述').prefault('')
        ).prefault({}),

        // 关系数值
        关系数值: z.object({
          // 当前值
          好感度: z.coerce.number()
            .transform(value => _.clamp(value, -100, 40))
            .prefault(0),

          // 变化值
          好感度变化量: z.coerce.number().prefault(0),

          // 好感增加上限
          今日好感度增加: z.coerce.number()
            .transform(value => Math.max(0, value))
            .transform(value => Math.min(value, 10))
            .prefault(0)
        }).prefault({})
      }).prefault({})
    ).prefault({})
  }).prefault({})
});

(() => {
  registerMvuSchema(Schema);
})()
