<template>
    <div>
        <van-search 
        shape="round" 
        v-model="value" 
        placeholder="请输入搜索关键词" 
        @input='inputFn' />
        <div class="search_wrap" v-if="resultList.length===0">
            <p class="hot_title">热门搜索</p>
            <div class="hot_name_wrap">
                <span class="hot_item" 
                v-for="(item,index) in hotList" 
                :key="index" 
                @click="fn(item.first)">
                    {{ item.first }}
                </span>
            </div>
        </div>

        <div class="search_wrap" v-else>
            <p class="hot_title">最佳匹配</p>
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
            <SongItem v-for="obj in resultList" 
            :key="obj.id"
            :name="obj.name"
            :author="obj.ar[0].name"
            :id="obj.id"
            ></SongItem>
            </van-list>
        </div>
    </div>
</template>

<script>
    import { hotSearchAPI,searchResultListAPI} from '@/api';
    import SongItem from '@/components/SongItem.vue';
export default {
    components:{
        SongItem
    },
    data() {
        return {
            value: '',
            hotList:[], //热搜关键字
            resultList:[], //搜索结果
            loading:false, //加载中  只有为false的时候才会触发onload
            finished:false, //未加载全部  (true为全部加载完成)
            page:1,//当前搜索结果的页码
            timer:null // 输入框防抖的计时器
        };
    },
    async created(){
        const res = await hotSearchAPI()
        console.log(res);
        this.hotList = res.data.result.hots
    },
    methods:{
        async getListFn(){
            return await searchResultListAPI({
                keywords:this.value,
                limit:20,
                offset:(this.page-1)*20  //固定公式
            })
            // async修饰的函数默认返回一个全新的promise对象
            //拿到getListFn的返回值用await提取结果
        },
        async fn(val){
            this.page = 1  //重新获取第一页数据
            this.finished = false;
            this.value=val
            const res = await this.getListFn();
            console.log(res);
            this.resultList = res.data.result.songs
            this.loading = false;
        },
        async inputFn(){ //输入框值改变
            this.page = 1  //重新获取第一页数据
            //防抖：计时n秒，最后执行1次，如果再次出发，重新计时
            if(this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(async ()=>{
                this.finished = false;
                if(this.value.trim().length==0){
                    //如果搜索关键词没有那就把搜索结果清空阻止网络请求，提前return
                    this.resultList=[];
                    return
                }
                const res = await this.getListFn();
                if(res.data.result.songs===undefined){ //无数据
                    this.resultList=[];
                    return
                }
                console.log(res);
                this.resultList = res.data.result.songs
                this.loading = false;
            },900)

        },
        async onLoad(){ //触底事件 内部自动将loading改为true
            this.page++;
            const res = await this.getListFn()
            if(res.data.result.songs===undefined){ //无更多数据
                this.finished = true  //list再次触发都不会执行onload函数（显示“没有更多数据”）
                this.loading = false;
                return
            }
            this.resultList = [...this.resultList,...res.data.result.songs]
            this.loading = false;
        }
    }
}
</script>

<style scoped>
    /* 搜索容器的样式 */
    .search_wrap {
        padding: 0.266667rem;
    }

    /*热门搜索文字标题样式 */
    .hot_title {
        font-size: 0.32rem;
        color: #666;
    }

    /* 热搜词_容器 */
    .hot_name_wrap {
        margin: 0.266667rem 0;
    }

    /* 热搜词_样式 */
    .hot_item {
        display: inline-block;
        height: 0.853333rem;
        margin-right: 0.213333rem;
        margin-bottom: 0.213333rem;
        padding: 0 0.373333rem;
        font-size: 0.373333rem;
        line-height: 0.853333rem;
        color: #333;
        border-color: #d3d4da;
        border-radius: 0.853333rem;
        border: 1px solid #d3d4da;
    }
    .van-cell{
        border-bottom:1px solid lightgray
    }
</style>