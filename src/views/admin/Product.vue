<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input @clear='handleSearchList' clearable style="width: 203px" v-model="listQuery.productName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input @clear='handleSearchList' clearable  style="width: 203px" v-model="listQuery.productNo" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select  @change='changeFindType()' v-model="listQuery.productType" placeholder="请选择分类" clearable>
              <el-option
                v-for="(item,index) in productType"
                :key="index"
                :label="item.product_type"
                :value="item.product_type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select @change='changeFindBrand()' v-model="listQuery.productBrand" placeholder="请选择品牌" clearable>
              <el-option
                v-for="(item,index) in productBrand"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select  @change='changeFindIsSale()' v-model="listQuery.isSale" placeholder="全部" clearable>
              <el-option
                v-for="(item,index) in saleStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新品状态：" prop="isNew">
            <el-select @change='changeFindIsNew()' v-model="listQuery.isNew" placeholder="全部" clearable>
              <el-option v-for="(item,index) in newStatus" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        type="success"
        @click="handleAddProduct()"
        size="mini">
        添加商品
      </el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
         <el-table-column label="#" type="index" width="100" align="center">
        </el-table-column>
        <el-table-column v-if="false" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="商品图片"  align="center">
          <template slot-scope="scope">
              <el-image :preview-src-list="[scope.row.productUrl]" style="width: 150px; height: 150px" :src="scope.row.productUrl"/>
            </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
            <p>{{scope.row.productDescribe}}</p>
            <p>品牌：{{scope.row.productBrand}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <p>进价：￥{{scope.row.inPrice}}</p>
            <p>出价：￥{{scope.row.outPrice}}</p>
            <p>货号：{{scope.row.productNo}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handleProductStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isSale">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isNew">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productStock}}</template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.saleStock}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small" clearable
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        productName:null,
        productNo:null,
        productType:null,
        productBrand:null,
        isSale:null,
        isNew:null,
    };
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Product',
        data() {
            return {
                // 新品搜索下单栏
                newStatus:[{value: 1,label: '新品'}, {value: 0,label: '非新品' }], 
                saleStatus:[{value: 1,label: '上架'}, {value: 0,label: '下架' }], // 商品状态搜索
                listQuery:Object.assign({}, defaultListQuery),
                productType: [], // 商品类型名称
                productBrand: [], // 商品品牌名称
                operates: [ // 批量操作
                {
                    label: "商品上架",
                    value: "productOn"
                },
                {
                    label: "商品下架",
                    value: "productOff"
                },
                {
                    label: "设为新品",
                    value: "newOn"
                },
                {
                    label: "取消新品",
                    value: "newOff"
                },
                ],
                operateType: null, // 批量操作类型 
                multipleSelection: [], // 需要批量操作的数据
                list:null, // 商品列表
                total: null, // 总共的商品数
            }
        },
        created(){
            // 获取所有的商品
            this.getAllProduct()
            // 创建时获取所有ProductTypeName
            this.getAllProductBrandName()
            // 创建时获取所有的类型内容
            this.getAllProductType()
        },
        methods:{
            // 根据状态搜索商品 
            changeFindIsSale(){
              this.getAllProduct()
            },
            // 根据商品新品搜索商品
            changeFindIsNew(){
              this.getAllProduct()
            },
            // 根据品牌搜索商品
            changeFindBrand(){
              this.getAllProduct()
            },
            // 根据分类搜索商品
            changeFindType(){
              this.getAllProduct()
            },
            // 搜索商品
            handleSearchList(){
              this.getAllProduct()
            },
            // 重置搜索框
            handleResetSearch(){
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            // 新增商品
            handleAddProduct(){
              this.$router.push({path:'/admin/addProduct'})
            },
            // 更改商品上下架状态
            async handleProductStatusChange(index,row){
              let isSale = row.isSale == 0 ? 0:1 
              let productId = row.productId
              let product={
                isSale:isSale,
                productId:productId,
              }
              const result = await this.$http.post("/productAdmin/updateProduct",product)
              if(result.data.code === 200){
                  this.getAllProduct()
              }
            },
            // 更改商品新品状态
            async handleNewStatusChange(index,row){
              let isNew = row.isNew == 0 ? 0:1 
              let productId = row.productId
              let product={
                isNew:isNew,
                productId:productId
              }
              const result = await this.$http.post("/productAdmin/updateProduct",product)
              if(result.data.code === 200){
                  this.getAllProduct()
              }
            },
            // 编辑商品信息
            handleUpdateProduct(index,row){
              this.$router.push({path:'/admin/updateProduct',query:{productId:row.productId}});
            },
            // 删除商品信息
            async handleDelete(index,row){
              
              // 先弹框
                const res = await this.$confirm('此操作将永久删除当前商品, 是否继续?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return;
              const result = await this.$http.delete('/productAdmin/deleteProduct?productId='+row.productId)
              if(result.data.code === 200){
                this.$message.success(result.data.message)
                this.getAllProduct()
              }
            
            },
            // 勾选商品信息
            handleSelectionChange(val){
                this.multipleSelection = val
            },
            // 获取所有的品牌类型
            async getAllProductBrandName(){
                const result = await this.$http.get('/product/productBrand/findAllBrandName')
                if(result.data.code === 200){
                   this.productBrand = result.data.data
                }
            },
            // 获取所有类型的内容
            async getAllProductType(){
                 const result = await this.$http.get('/product/findAllByType')
                 if(result.data.code === 200){
                     this.productType = result.data.data
                 }
            },
            // 处理分页
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getAllProduct();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getAllProduct();
            },
            // 获取所有的商品
            async getAllProduct(){
                const result = await this.$http.post('/productAdmin/findAllByCon',this.listQuery)
                if(result.data.code === 200){
                    this.list =result.data.data.products
                    this.list.forEach(item => {
                        item.productUrl = this.$serve +  item.productUrl
                    });
                    this.total = result.data.data.productCount
                }
                
                
            },
            // 更改商品状态
            async updateProductStatus(isSale,value){
              let params = new URLSearchParams();
              params.append('isSale', isSale);  
              params.append('ids', value);
              params.append("isNew",-1);
               const result = await this.$http.post('/productAdmin/updateProductState',params)
               if(result.data.code === 200){
                 this.$message.success(result.data.message)
                 this.getAllProduct()
               }
            },
            // 更改新品状态
            async updateIsNew(isNew,value){
              let params = new URLSearchParams();
              params.append('isSale', -1);  
              params.append('ids', value);
              params.append("isNew",isNew);
               const result = await this.$http.post('/productAdmin/updateProductState',params)
               if(result.data.code === 200){
                 this.$message.success(result.data.message)
                 this.getAllProduct()
               }
            },
            // 处理批量操作
            handleBatchOperate() {
              if(this.operateType==null){
              this.$message({
                  message: '请选择操作类型',
                  type: 'warning',
                  duration: 1000
              });
              return;
              }
              if(this.multipleSelection==null||this.multipleSelection.length<1){
              this.$message({
                  message: '请选择要操作的商品',
                  type: 'warning',
                  duration: 1000
              });
              return;
              }
              this.$confirm('是否要进行该批量操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
              let ids=[];
              for(let i=0;i<this.multipleSelection.length;i++){
                  ids.push(this.multipleSelection[i].productId);
              }
              switch (this.operateType) {
                  case this.operates[0].value:
                  this.updateProductStatus(1,ids);
                  break;
                  case this.operates[1].value:
                  this.updateProductStatus(0,ids);
                  break;
                  case this.operates[2].value:
                  this.updateIsNew(1,ids);
                  break;
                  case this.operates[3].value:
                  this.updateIsNew(0,ids);
                  break;
                  default:
                  break;
              }
            });
      },
    }
   }
</script>
<style Lang='less' scoped>
    .operate-container {
        margin-top: 20px;
    }
    .operate-container .btn-add {
        float: right;
    }
    .table-container {
        margin-top: 20px;
    }
    .batch-operate-container, .pagination-container {
        display: inline-block;
        margin-top: 20px;
    }
    .pagination-container {
        float: right;
    }
    .el-pagination {
        margin-top: 0;
    }
</style>