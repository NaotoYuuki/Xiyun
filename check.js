await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
	// 日期
	const old_year = _.get(old_variables, `stat_data.世界路径.当前日期.年`);
	const old_month = _.get(old_variables, `stat_data.世界路径.当前日期.月`);
	const old_day = _.get(old_variables, `stat_data.世界路径.当前日期.日`);
	const new_year = _.get(new_variables, `stat_data.世界路径.当前日期.年`);
	const new_month = _.get(new_variables, `stat_data.世界路径.当前日期.月`);
	const new_day = _.get(new_variables, `stat_data.世界路径.当前日期.日`);
	
	const groups = ['可攻略人物', '其他人物'];
  
	groups.forEach(group => {
		const old_targets = _.get(old_variables, `stat_data.人物档案.${group}`);
		const new_targets = _.get(new_variables, `stat_data.人物档案.${group}`);
	
		Object.keys(new_targets).forEach(characterKey => {
		    // 地址
			const base_path = `${characterKey}.关系数值.好感度`;
			const basedelta_path = `${characterKey}.关系数值.好感度变化量`;
			const desire_path = `${characterKey}.关系数值.性欲度`;
			const desiredelta_path = `${characterKey}.关系数值.性欲度变化量`;
			const sex_path = `${characterKey}.关系数值.淫乱度`;
			const sex_delta_path = `${characterKey}.关系数值.淫乱度变化量`;
			const daily_path = `${characterKey}.关系数值.今日好感度增加`;
			const last_update_path = `${characterKey}.关系数值.最后更新日期`;
			const confess_path = `${characterKey}.告白状态.是否为恋人`;
			const unlock_path = `${characterKey}.基础信息.是否解锁`;
			const showreal_path = `${characterKey}.基础信息.是否暴露身份`;
			const name_path = `${characterKey}.基础信息.姓名`;
			const fakename_path = `${characterKey}.基础信息.假名`;
			
			// 好感度
			const old_value = _.get(old_targets, base_path);
			const new_value = _.get(new_targets, base_path);

			// 性欲度
			const desire_value = _.get(old_targets, desire_path);
			const desire_newvalue = _.get(new_targets, desire_path);

			// 淫乱度
			const sex_value = _.get(old_targets, sex_path);
			const sex_newvalue = _.get(new_targets, sex_path);
			
			// 好感度增加
			const old_daily = _.get(old_targets, daily_path);
			const new_daily = _.get(new_targets, daily_path);
			
			// 最后更新日期
			// const old_last_update = _.get(old_targets, last_update_path);
			// const new_last_update = _.get(new_targets, last_update_path);
			
			// 是否为恋人
			const confess_value = _.get(new_targets, confess_path);
			const confessold_value = _.get(old_targets, confess_path);
			
			// 是否解锁
			const unlock_value = _.get(new_targets, unlock_path);
			const unlock_oldvalue = _.get(old_targets, unlock_path);
			
			// 是否暴露
			const showreal_value = _.get(new_targets, showreal_path);
			const showreal_oldvalue = _.get(old_targets, showreal_path);
			
			// 是否暴露
			const name = _.get(new_targets, name_path);
			const fakename = _.get(new_targets, fakename_path);
			
			// 真假名判断
			var charactername = name
			if ((showreal_value === false) && (fakename !== '')) {
				charactername = fakename;
			}
			
			// 换日时重置好感度增加
			var daily_reset = false;
			if ((old_day !== new_day) || (old_month !== new_month) || (old_year !== new_year)) {
				_.set(new_targets, daily_path, 0);
				daily_reset = true;
				// toastr.info(`${charactername}每日好感度增加限制已重置`);
			}
			
			// 未解锁时不改变值
			if (unlock_value === false) {
				_.set(new_targets, base_path, old_value);
				_.set(new_targets, desire_path, desire_value);
				_.set(new_targets, sex_path, sex_value);
				_.set(new_targets, daily_path, old_daily);	
			}
			else {
				// 解锁信息
				if (unlock_oldvalue === false) {
					toastr.info(`${charactername} 已解锁`);
				}
				
				// 告白信息
				if ((confessold_value !== confess_value) && (confess_value === true)) {
					toastr.info(`${charactername} 已确认恋人关系`);
				}
				
				// 暴露信息
				if ((showreal_value !== showreal_oldvalue) && (showreal_value === true)) {
					toastr.info(`${charactername} 信息已更新`);
				}
				
				// 好感度处理
				var value_delta = new_value - old_value;
				
				// 每次增加值不超过5
				if (value_delta > 5) {
					value_delta = 5;
				}
				
				// 未告白时好感度不超过70，告白后好感度不会低于70
				if (confess_value === false){
					if (new_value > 70) {
						value_delta = 70 - old_value;
					}
				}
				else {
					if (value_delta < 0) {
						if (old_value > 70) {
							if (new_value <= 70) {
								value_delta = 71 - old_value;
							}
						}
						else {
							value_delta = 0;
						}
					}
				}
				
				// 确保每日最大好感度增加量为10
				var daily_value = old_daily
				if (daily_reset) {
					daily_value = 0;
				}
					
				if (value_delta !== 0) {
					if (daily_value + value_delta >= 10) {
						value_delta = 10 - daily_value;
						
						if (daily_value < 10) {
							toastr.info(`${charactername} 今日好感度增加达到上限`);
						}
					}
				}
				_.set(new_targets, daily_path, (daily_value + value_delta));
				// toastr.info(`${charactername}今日好感度已增加: ${daily_value + value_delta}`);
				
				// 更新好感度
				_.set(new_targets, base_path, (old_value + value_delta));
				_.set(new_targets, basedelta_path, value_delta);
				// toastr.info(`${charactername}本次好感度变化量: ${value_delta}`);
				
				if (group === '可攻略人物') {
					// 性欲度处理
					var desire_delta = desire_newvalue - desire_value;
				
					// 每次增加值不超过5
					if (desire_delta > 5) {
						desire_delta = 5;
					}
				
					// 更新性欲度
					_.set(new_targets, desire_path, (desire_value + desire_delta));
					_.set(new_targets, desiredelta_path, desire_delta);
					// toastr.info(`${charactername}本次性欲度变化量: ${desire_delta}`);
				
					// 淫乱度处理
					var sex_delta = sex_newvalue - sex_value;
				
					// 每次增加值不超过5
					if (sex_delta > 5) {
						sex_delta = 5;
					}
				
					// 更新性欲度
					_.set(new_targets, sex_path, (sex_value + sex_delta));
					_.set(new_targets, sex_delta_path, sex_delta);
					// toastr.info(`${charactername}本次淫乱度变化量: ${sex_delta}`);
				}
			}
		});
	});
});
