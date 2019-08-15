<view class="containers">
  <view class="city_title">城市</view>
  <view class="content">
    <view class="city_name" qq:for="{{city_list}}" qq:key="{{item}}" data-cid="{{item.id}}" bindtap="bindNativeCity">{{item.name}}<image src="../../images/yes.png" mode='aspectFill' qq:if="{{item.is_show}}"></image></view>
  </view>
</view>
<view class='footer'>
    本系统仅供参考，具体分类要求以属地专业管理部门为准。
    <text class="dev_own" catchtap='changeJoeling'>技术支持：袁小威</text>
  </view>