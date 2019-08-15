<view class="container">
  <view class="containers">
    <view class="content">
      <view class="none_list" qq:if="{{is_show}}">没有更多数据了</view>
      <view class="spec_name" qq:for="{{spec_list}}" qq:key="{{item}}" bindtap="bindNativeSpecial" data-sid="{{item.id}}">
        <view class="spec_left">
          <image src="{{item.pic}}" mode='aspectFill'></image>
          {{item.name}}
        </view>
        <image src="../../images/jt.png" mode='aspectFill'></image>
      </view>
    </view>
  </view>
  <ad unit-id="ca6bfdd371bb6a08ff3e7efed147ba73"></ad>
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