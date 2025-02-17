/**
 * @title 深度思考版傻妞AI
 * @create_at 2025-02-09 22:15:58
 * @author 佚名
 * @version v1.0.0
 * @description 支持思考过程提示的DeepSeek-R1模型
 * @public true
 * @rule ^傻妞 (.+)$ 
 */
async function main() {
    try {
        const userQuestion = s.param(1).trim();
        if (!userQuestion) return s.reply("请告诉我您的问题~");

        // 预处理特殊问题
        if (/模型|什么AI|你(是|的)谁|谁造你/.test(userQuestion)) {
            s.reply("傻妞：\n正在检索模型信息...（深度思考可能需要10-15秒）");
        } else {
            s.reply("傻妞：\n正在启动认知引擎...（复杂问题可能需要10-15秒深度推理）");
        }

        const response = await fetch("https://api.lkeap.cloud.tencent.com/v1/chat/completions", {  //腾讯云接口
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer sk-BjuL6BF2eMHqPAG` //腾讯云sk用自己的ok？
            },
            body: JSON.stringify({
                model: "deepseek-r1",
                messages: [{
                    role: "system",
                    content: "你叫'傻妞'，回答时要先说明自己是DeepSeek-R1模型，用口语化中文回答，重要数据要换行展示"
                }, {
                    role: "user", 
                    content: userQuestion
                }],
                stream: false
            })
        });

        if (response.status !== 200) {
            const error = await response.json();
            throw new Error(`服务暂时短路啦: ${error.error?.message || '未知错误'}`);
        }

        const { choices } = await response.json();
        let answer = choices?.[0]?.message?.content;
        
        // 规范化回答格式
        if (!answer.includes("DeepSeek-R1")) {
            answer = `【我是DeepSeek-R1深度思考模型】\n${answer}`;
        }
        
        s.reply(`傻妞：\n${answer.replace(/^\s+/, '')}`);

    } catch (e) {
        s.reply(`傻妞：\n(；´д｀)ゞ 大脑连接不稳定，请再试一次~ 错误详情：${e.message}`);
    }
}

main();
