<template>
    <div class='center-box'>
        <!-- <el-skeleton style="width: 240px" :loading="true" animated>
            <template slot="template">
                <el-skeleton-item variant="image" style="width: 240px; height: 240px;" />
                <div style="padding: 14px;">
                    <el-skeleton-item variant="h3" style="width: 50%;" />
                    <div
                        style="display: flex; align-items: center; justify-items: space-between; margin-top: 16px; height: 16px;">
                        <el-skeleton-item variant="text" style="margin-right: 16px;" />
                        <el-skeleton-item variant="text" style="width: 30%;" />
                    </div>
                </div>
            </template>
        </el-skeleton> -->
        <template v-if="message">
            <div>
                {{ message }}
            </div>
        </template>
        <template v-else>
            <!-- 页面标题 -->
            <!-- <div class="header-box">溯源档案</div> -->
            <!-- 产品logo图 -->
            <div class="logo-box">
                <img :src="urlLogo + item.mainimg" alt="">
                <div>{{ item.name }}</div>
            </div>
            <!-- 产品描述 -->
            <div class="describe-box">
                <div class="title1">指标描述</div>
                <div class="center">{{ item.describe }}</div>
                <!-- 简介 -->
                <div class="detailed-box">
                    <!-- 顶部介绍 -->
                    <div class="top">
                        <div class="plantSpecies">
                            <div class="lable">种植作物</div>
                            <div class="value">{{ item.spName }}</div>
                        </div>
                        <div class="breed">
                            <div class="lable">种植品种</div>
                            <div class="value">{{ item.breed }}</div>
                        </div>
                        <div class="timer">
                            <div class="lable">创建时间</div>
                            <div class="value">{{ item.create_time }}</div>
                        </div>
                    </div>
                    <!-- 企业 -->
                    <div class="enterprise">
                        <div class="enterprise-img"></div>
                        <div class="enterprise-info">
                            <div class="enterprise-name">{{ item.ename }}</div>
                            <div class="enterprise-userName">负责人：{{ item.fr }}</div>
                            <div class="enterprise-address">地址：{{ item.enaddr }}</div>
                        </div>
                    </div>
                    <!-- 产品简介 -->
                    <div class="product-introductio">
                        <div class="title">产品简介</div>
                        <div class="content">{{ item.descript }}</div>
                    </div>
                    <!-- 档案完整量 -->
                    <div class="completion-degree">
                        <div class="title">档案完整量</div>
                        <div class="content">
                            <el-rate disabled v-model="item.value"></el-rate>
                        </div>
                    </div>
                    <!-- 操作 -->
                    <div class="operate">
                        <div class="operate-item" v-for="(item, index) in operateList" :key="index">
                            <img :src="item.url" alt="">
                            <div class="title">{{ item.title }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { Loading } from 'element-ui';
import { axios } from "../util/request"
var url = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjMwcHgiIGhlaWdodD0iMzBweCIgdmlld0JveD0iMCAwIDM4IDQ4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0MCAoMzM3NjIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlNoYXBlIENvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0idjIuMi4wIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i6aaW6aG1Lem7mOiupOaViOaenC1jb3B5LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MC4wMDAwMDAsIC0xOS4wMDAwMDApIiBmaWxsPSIjNDA5RUZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTIxMi4xMzU0NDEsNDUuMTU3ODA3NyBaIE0xMDMuNDE2NTAyLDQ2LjIxNzU1MTEgQzEwMy40MDcwMDgsNDcuNzk0NTY4MiAxMDIuNTg3ODQxLDQ4LjE0NjM0NzQgMTAyLjU4Nzg0MSw0OC4xNDYzNDc0IEMxMDIuNTg3ODQxLDQ4LjE0NjM0NzQgODguNDUyMDQ3OCw1Ni4zMTQ1MDg3IDg3LjUzMjk5NTYsNTYuODI2Mjc1MSBDODYuNjIyMzM2LDU3LjIxNzE1NjEgODYuMDEzNjcwMyw1Ni44MjYyNzUxIDg2LjAxMzY3MDMsNTYuODI2Mjc1MSBDODYuMDEzNjcwMyw1Ni44MjYyNzUxIDcxLjIyMjU3MDYsNDguMjQ3OTU3MiA3MC42ODI2OTYyLDQ3Ljg3MDg0NDQgQzcwLjE0MjY4NDMsNDcuNDkzNzMxNiA3MC4xMzAxNjQzLDQ2LjkwNjM3NzQgNzAuMTMwMTY0Myw0Ni45MDYzNzc0IEM3MC4xMzAxNjQzLDQ2LjkwNjM3NzQgNzAuMTQ1MDIzMiwyOS45MTk5MTc0IDcwLjEzMDE2NDMsMjkuMTMzMzM2NCBDNzAuMTE1MzA1MywyOC4zNDY2MTc3IDcxLjA5Njk1NzYsMjcuNzU1NTQ2MSA3MS4wOTY5NTc2LDI3Ljc1NTU0NjEgTDg1Ljg3NTUzNzMsMTkuMjEzNDM4NyBDODYuNzg1MzcxNCwxOC43MzMyMDE2IDg3LjY3MTEyODYsMTkuMjEzNDM4NyA4Ny42NzExMjg2LDE5LjIxMzQzODcgQzg3LjY3MTEyODYsMTkuMjEzNDM4NyAxMDAuNzI2NjIzLDI2LjgwMjA5MzcgMTAyLjE3MzQ0MiwyNy42MTc3MjU3IEMxMDMuNTkxNTA3LDI4LjI5MTk1NzcgMTAzLjQxNjUwMiwyOS42ODQzNDI0IDEwMy40MTY1MDIsMjkuNjg0MzQyNCBDMTAzLjQxNjUwMiwyOS42ODQzNDI0IDEwMy40MjUzMDcsNDQuNzUxOTE5MiAxMDMuNDE2NTAyLDQ2LjIxNzU1MTEgTDEwMy40MTY1MDIsNDYuMjE3NTUxMSBaIE05Ny41MTYwMTA1LDI5LjE2OTEzMzkgQzk0LjQ5MDAxNzMsMjcuNDI3NDQ4MyA4Ny4zNjE1ODQyLDIzLjI5NzEwNjMgODcuMzYxNTg0MiwyMy4yOTcxMDYzIEM4Ny4zNjE1ODQyLDIzLjI5NzEwNjMgODYuNjY2MTAzOSwyMi45MjEyMzI2IDg1Ljk1MTc3NDcsMjMuMjk3MTA2MyBMNzQuMzQ4NzQwNiwyOS45ODIxNSBDNzQuMzQ4NzQwNiwyOS45ODIxNSA3My41NzgwMDI1LDMwLjQ0NDkwMTQgNzMuNTg5Njk3LDMxLjA2MDQ4MDUgQzczLjYwMTM5MTUsMzEuNjc2MDU5NyA3My41ODk2OTcsNDQuOTY5ODcwOCA3My41ODk2OTcsNDQuOTY5ODcwOCBDNzMuNTg5Njk3LDQ0Ljk2OTg3MDggNzMuNTk5NDY1NCw0NS40Mjk1OTMyIDc0LjAyMzQ5NTEsNDUuNzI0NjQ3MiBDNzQuNDQ3Mzg3Myw0Ni4wMTk3MDExIDg2LjA2MDE4OTgsNTIuNzMzMjQ1MSA4Ni4wNjAxODk4LDUyLjczMzI0NTEgQzg2LjA2MDE4OTgsNTIuNzMzMjQ1MSA4Ni41MzgxNTIsNTMuMDM5MTc1OSA4Ny4yNTMwMzE1LDUyLjczMzI0NTEgQzg3Ljk3NDY1MjYsNTIuMzMyNzI2MiA5OS4wNzMwMzM1LDQ1Ljk0MDI1ODIgOTkuMDczMDMzNSw0NS45NDAyNTgyIEM5OS4wNzMwMzM1LDQ1Ljk0MDI1ODIgOTkuNzE2MjMyNSw0NS42NjQ4OTI5IDk5LjcyMzY2MTksNDQuNDMwNzA1NiBDOTkuNzI1NzI1Nyw0NC4wNzQ3OTU5IDk5LjcyNjU1MTIsNDIuNjkzMjg4MSA5OS43MjY2ODg3LDQwLjk1NzUyMjkgTDg2LjY2MDA1MDIsNDguODc1MjM5NCBMODYuNjYwMDUwMiw0NS44NDYyMjEgQzg2LjY2MDA1MDIsNDQuNjAyMTIwNSA4Ny42MjMxMjg5LDQzLjc4MDk4MTEgODcuNjIzMTI4OSw0My43ODA5ODExIEw5OS4xODA3NjA3LDM2LjgxNjU3OTMgQzk5LjYxNjg5NzgsMzYuMzYxMTI1MSA5OS43MDY4NzY4LDM1LjYzMTU0NDcgOTkuNzI1NDUwNSwzNS4zNTU2Mjg3IEM5OS43MjUwMzc4LDM0LjA5MDQ2MjcgOTkuNzI0NDg3NCwzMi45ODUyODQxIDk5LjcyNDA3NDcsMzIuMjg1MTY3OCBMODYuNjYwMDUwMiw0MC4yMDEyMzIxIEw4Ni42NjAwNTAyLDM3LjAzNDUzMSBDODYuNjYwMDUwMiwzNS43OTA0MzA1IDg3LjQ4NTU0NjIsMzUuMjQ0NjU2NCA4Ny40ODU1NDYyLDM1LjI0NDY1NjQgTDk3LjUxNjAxMDUsMjkuMTY5MTMzOSBaIiBpZD0iU2hhcGUtQ29weSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'
export default {
    name: '',
    props: {},
    data() {
        return {
            loading: true,
            id: null,
            urlLogo: 'http://47.99.91.203:9090/shucun/sys/common/static/',
            item: {
                name: '草莓',
                describe: '草莓好好吃啊',
                breed: '淡雪',
                timer: '2021-04-02',
                enterpriseName: '内蒙古有限公司',
                enterpriseUserName: '张奥林',
                enterpriseAddress: '内蒙古拉萨市',
                introductio: '草莓（学名：Fragaria × ananassa Duch.）是蔷薇科草莓属多年生草本植物。草莓根系较浅，茎可根分为新茎、根状茎和匍匐茎。草莓叶为基生三出复叶，具长叶柄，花绝大多数为两性花，花序为有限聚伞花序。草莓的果实由花托膨大发育而成，果实生长曲线呈典型的S形。草莓种子是受精后的子房膨大形成的瘦果，附着在膨大花托的表面[野生草莓起源于欧洲、美洲和亚洲，现代大果型栽培草莓则起源于法国。1915年，中国最早引入的现代草莓，是俄罗斯侨民自莫斯科引入黑龙江亮子坡种植的“维多利亚”品种。中国范围内均有草莓的商业化生产，其草莓栽培面积和产量均居世界第一位。草莓根系较浅，具有喜光耐阴、喜水怕涝等特点草莓具有较高的营养价值、医疗价值和生态价值。草莓浆果芳香多汁，营养丰富，素有“水果皇后”的美称，又是果树中上市最早的鲜果，素有“早春第一果”的美称。草莓含有较高的维生素、钙、磷、铁等营养物质，[6]  且草莓中含有众多活性物质，可清凉止渴，健胃消食的功效，具有一定的医疗价值，在书籍如《台湾药用植物志》有体现。  草莓也可作为观赏、绿化植物，已成为中国西部地区农民脱贫致富的首选作物',
                value: 3.7
            },
            operateList: [{
                url,
                title: '生长期图片'
            },
            {
                url,
                title: '肥料使用表'
            },
            {
                url,
                title: '农药使用表'
            },
            {
                url,
                title: '关键环境数据'
            },
            {
                url,
                title: '农事记录'
            },
            {
                url,
                title: '认证信息'
            },
            {
                url,
                title: '种子来源信息'
            }],
            loadingInstance: null,
            message: null,//提示信息
        }
    },
    created() {
        this.id = this.$route.query.id;
        this.getData()
        this.loadingInstance = Loading.service({
            target: 'center-box',
            text: '努力加载中...',
            background: '#fefefe'
        });
    },
    methods: {
        getData() {
            axios({
                url: `/scspecialtyproduct/scSpecialtyproduct/selectById?id=${this.id}`,
                method: 'get', // default
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.item = { ...data.result, ...this.item }
                } else {
                    this.message = data.message
                }
                this.loadingInstance.close();
            }).catch(res => {
                this.message = '网络出错了'
                this.loadingInstance.close();
            })
        }
    },
}
</script>
<style scoped lang="scss">
$padding-left: 0.33rem;
$box-width: 9.433962264150944rem;
$border: 1px dashed #a59999;
$marginTopBot: .35rem;
$StarSize: 0.9433962264150944rem;
$fontColor1: rgb(145, 145, 145);

.center-box {
    font-size: 13px;
    width: 10rem;
    // height: 100%;

    // .header-box {
    //     text-align: center;
    // }

    .logo-box {
        width: 10rem;
        height: 7.2rem;

        img {
            width: 100%;
            height: 94%;
        }

        div {
            margin-left: $padding-left;
        }

    }

    .describe-box {
        margin: .45rem .3rem 0;
        padding-top: .2rem;
        border-top: $border;

        .title1 {
            color: $fontColor1;
            font-size: 0.35rem;
            text-align: center;
            margin-bottom: $marginTopBot;
        }

        .title {
            font-size: 0.35rem;
            text-align: center;
        }

        .center {
            margin-top: .2rem;
        }

        .detailed-box {

            .top {
                width: $box-width;
                margin-top: $marginTopBot;
                padding: $marginTopBot 0;
                border-top: $border;
                border-bottom: $border;
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;

                .plantSpecies,
                .timer,
                .breed {
                    // padding: 0 2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    border-right: $border;
                }

                .timer {
                    border-right: none;
                }

                .lable {
                    width: 2rem;
                    height: .7rem;
                    border-radius: .15rem;
                    background-color: orange;
                    color: white;
                    text-align: center;
                    line-height: .7rem;
                    font-size: 10px;
                    margin-bottom: .25rem;
                }

                .value {
                    text-align: center;
                }
            }

            .enterprise {
                margin: 0.2358490566037736rem 0 $marginTopBot 0;
                display: flex;
                font-size: 0.35rem;

                .enterprise-img {
                    width: 1.4150943396226416rem;
                    height: 1.4150943396226416rem;
                    margin-right: 0.2358490566037736rem;
                    background-color: orange;
                    border-radius: 50%;
                }

                .enterprise-info {
                    font-size: 8px;

                    div {
                        line-height: .43rem;
                        color: $fontColor1;
                    }
                }
            }

            .product-introductio {
                border-top: $border;
                padding: $marginTopBot 0 0 0;

                .title {
                    color: $fontColor1;
                }

                .content {
                    padding: 0 .3rem;
                }
            }

            .completion-degree {
                border-top: $border;
                padding: 0.33018867924528306rem 0 0.5787330316742081rem 0;
                margin-top: 0.33018867924528306rem;

                .content {
                    display: flex;
                    justify-content: center;
                }
            }

            .operate {
                border-top: $border;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: .5rem .3rem 0;

                .operate-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    width: 4.090909090909091rem;
                    height: 2.9545454545454546rem;
                    border: 1px solid orange;
                    border-radius: .2rem;
                    margin-bottom: 0.45454545454545453rem;

                    img {
                        width: 2rem;
                        height: 1.5rem;
                    }
                }
            }
        }
    }

}
</style>
