<view class="container">
  <view class="exam" qq:if="{{is_have}}" style="position:relative;z-index:999999">
    <view class="exam_count">{{index}}
      <text class="ex_count_sum"> / {{count}}</text>
    </view>
    <view class="exam_content" qq:for="{{detail}}" qq:for-item="i" qq:if="{{i.is_show}}">
      <view class="exam_title">{{i.name}}</view>
      <view class="exam_xuan">
        <!-- <text class="exam_item" bindtap="bindExam" qq:for="{{fenlei_detail}}" qq:for-item="j" data-type="{{j.id}}" data-type_name="{{j.name}}" data-id="{{i.id}}">{{j.name}}</text> -->
        <button hover-class="exam_item_clover" class="exam_item" bindtap="bindExam" qq:for="{{fenlei_detail}}" qq:for-item="j" data-type="{{j.id}}"  data-type_name="{{j.name}}" data-id="{{i.id}}" hover-stay-time="800">{{j.name}}</button>
      </view>
    </view>
  </view>


  <view class="exam_over" qq:if="{{is_have == false}}" style="position:relative;z-index:999999">
    <view class="exam_over_title">垃圾分类随堂小测试</view>
    <view class="exam_iver_scope">{{scope}}分</view>
    <view class="exam_over_content">
      <view class="wxam_over_heaser">
        <view>题目</view>
        <view>我的答案</view>
        <view>正确答案</view>
      </view>
      <view class="wxam_over_item" qq:for="{{detail}}" qq:key="{{item}}">
        <view>{{item.name}}</view>
        <view qq:if="{{item.type != item.is_type}}" style="text-decoration:line-through">{{item.is_type_name}}</view>
        <view qq:else >{{item.is_type_name}}</view>
        <view>{{item.type_name}}</view>
      </view>
    </view>
  </view>
  <view class="exam_over_btn" qq:if="{{is_have == false}}" style="position:relative;z-index:999999">
    <button class='exam_over_btns' bindtap="bindImage">
      <image src='../../images/download.png' mode="widthFix"></image>
      保存成绩单
    </button>
    <button bindtap='bindAgain' class='exam_over_btns'>
      <image src='../../images/icon/restart-line.png' mode="widthFix"></image>
      再考一次 </button>
    <button open-type='share' class='exam_over_btns'>
      <image src='../../images/icon/guide_tag.png' mode="widthFix"></image>
      考考别人
    </button>
  </view>
  <canvas canvas-id='share' style='width:375px;height:580px;position:fixed;z-index:-1;right:-800rpx;' hidden='{{canvasHidden}}'></canvas>
  <ad unit-id="ff7976b154058f813da583db4f599c9c"></ad>
</view>