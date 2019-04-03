/**
 * 请求拦截器
 * 注：每加一个Handler必须在结果函数中处理 state 状态！
 * @Auther houzhenyu
 * @Date 2019-01-29
 */
module.exports = function () {
    /**
     * [ Fn-1 ] 路由拦截处理
     * @param  context
     */
    function routerHandler(context) {
        // 处理缺省路由跳转
        if (context.request.path == '/' || context.session.user) {
            return true;
        } else {
            context.status = 401
        }

        return false;
    }
    /**
     * [ Fn-2 ] 路由拦截处理
     * @param  context
     */
    async function routerEndHandler(context) {
        let message = '';
        // 处理不同请求结果状态码
        switch (context.status) {
            case 200:
                console.log(`${context.request.url} 请求完毕，一切正常...`);
                break;
            case 404:
                message = '您访问的页面不存在！';
                break;
            case 401:
                message = '认证信息异常！';
                break;
            default:
                message = '其它异常！';
        }
        if (message) {
            context.response.body = {
                code: context.status,
                msg: message
            };
            console.log(`${context.request.url} 服务${context.status}${message}`);
        }

    }
    // Todo.
    // midware-N ...

    /**
     * 中间件结果拦截处理
     */
    return async (context, next) => {
        // false 阻止请求执行
        var state = false;
        // 页面加载前路由处理
        state = routerHandler(context);
        // other midware ...

        // 放行！
        if (state) {
            try {
                await next();
            } catch (e) {
                context.response.body = {
                    code: -1,
                    msg: e.message,
                    stack: e.stack
                };
                console.log('Exception:', e);
            }
        }
        // 路由结束处理
        await routerEndHandler(context);
    };
}