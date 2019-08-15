<view class="container">
  <view class='content'>
    <view class='titles'>{{searec_name}}</view>
    <view class='title'><text qq:if="{{searec_name}}">属于</text>{{content.name}}</view>
    <image class="c_image" src='../../images/{{content.pic}}.png' mode="widthFix"></image>
    <text class='desc'>{{content.remark}}</text>
    <text class='sm_title'>投放指导</text>
    <text class='sm_remark' qq:for='{{content.remarks}}' qq:key="{{item}}">{{item}}</text>
  </view>
  <view class='tips' qq:if="{{content.tips}}">
    <icon type="warn" size="15" color='red' />
    <text class='tips_txt'>{{content.tips}}</text>
  </view>
  <ad unit-id="d3e30f416c3af30a163b5bbf799f0459"></ad>
  <view class='footer'>
    本系统仅供参考，具体分类要求以属地专业管理部门为准。
    <text class="dev_own" catchtap='changeJoeling'>技术支持：袁小威</text>
  </view>
</view>
<view class='share_btn'>
  <image src='../../images/icon/guide_tag.png' mode="widthFix"></image>
  <text>分享</text>
</view>
<button open-type='share' class='share_btyn'></button>