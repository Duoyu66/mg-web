import ArticleTOC from '@/component/ArticleTOC/index'

function TestBox() {
    const articleContent = `<h3 class="ql-align-justify">玩法介绍</h3>
<p class="ql-align-justify"><span class="text_CgLK7" data-text="true">游戏需要2名玩家一同进行冒险，玩家在游戏中将扮演相互看不顺眼、被魔咒变成了玩偶的科迪和小梅夫妇。他们一起被困在一个奇幻世界里，每个角落都隐藏着意想不到的东西，他们不得不一起克服挑战，同时挽救他们破裂的关系。</span></p>
<h3 class="ql-align-justify">章节攻略</h3>
<p>这款游戏需要两名玩家共同参与冒险。玩家将扮演一对由于矛盾而彼此疏远、被魔咒变成玩偶的夫妻&mdash;&mdash;科迪和小梅。他们被困在一个充满奇幻色彩的世界中，每个角落都隐藏着意想不到的挑战。他们不仅要携手度过重重难关，还要在冒险过程中修复破裂的婚姻关系。</p>
<h4>1. 棚屋</h4>
<p>剧情简介：故事从一对夫妻的争吵声开始，由于无法接受对方的缺点，这对夫妇决定离婚。屋子里的女儿目睹了这一切，她手握着两个玩偶，希望父母能够重归于好。</p>
<p>关卡：</p>
<ul>
<li><strong>序幕</strong></li>
<li><strong>当头一棒</strong></li>
<li><strong>奄奄一息</strong></li>
<li><strong>万丈深渊</strong></li>
<li><strong>接通电源</strong></li>
</ul>
<p><strong>BOSS：吸尘器</strong><br>攻略：吸尘器会通过管道吸取物品并向玩家发射。两名玩家需要协作，一人控制吸尘管将发射回来的物品吸入，另一人则需要瞄准并反击BOSS。注意躲避地面上的吸力攻击，并在适当时机将物品反击回去，造成伤害。</p>
<h4>2. 大树</h4>
<p>剧情简介：两人来到窗口，看见了一架望远镜，通过望远镜看到他们的本体正处于游离状态。为了破解这奇怪的状况，他们决定跳出窗户，前往房子。</p>
<p>关卡：</p>
<ul>
<li><strong>清新空气</strong></li>
<li><strong>捕获俘虏</strong></li>
<li><strong>根深蒂固</strong></li>
<li><strong>赶尽杀绝</strong></li>
<li><strong>远离尘嚣</strong></li>
</ul>
<p><strong>BOSS：松鼠</strong><br>攻略：松鼠会在战斗中投掷炸弹并使用剑进行攻击。玩家需要巧妙躲避炸弹，利用关卡中的弹药补给反击松鼠。当松鼠靠近时，另一名玩家可以使用剑与其对战，形成配合，迅速削弱BOSS的体力。</p>
<h4>3. 罗斯的房间</h4>
<p>剧情简介：两人回到家中，决定寻找女儿，但神秘的观察者正在默默注视着他们的行动。</p>
<p>关卡：</p>
<ul>
<li><strong>枕头堡垒</strong></li>
<li><strong>太空之旅</strong></li>
<li><strong>跳房子</strong></li>
<li><strong>火车站</strong></li>
<li><strong>恐龙乐园</strong></li>
<li><strong>海盗的问候</strong></li>
<li><strong>绝世表演</strong></li>
<li><strong>很久很久以前</strong></li>
<li><strong>地牢探险家</strong></li>
<li><strong>女王</strong></li>
</ul>
<p><strong>BOSS：宇宙猴子Moon Baboon</strong><br>攻略：Moon Baboon拥有激光攻击和导弹追踪能力。玩家需要密切配合，一人吸引火力，另一人寻找机会破坏BOSS的控制装置。通过躲避激光和反击导弹，逐步削弱BOSS的防御，并最终将其击败。</p>
<h4>4. 布谷鸟钟</h4>
<p>剧情简介：两人在床上发现了一封女儿的信，信中透露了解除诅咒的方法。然而，破书突然出现，撕毁了信纸，并将两人带入另一个奇幻空间。</p>
<p>关卡：</p>
<ul>
<li><strong>时间之门</strong></li>
<li><strong>钟表发条</strong></li>
<li><strong>陈年往事</strong></li>
</ul>
<p><strong>BOSS：时钟</strong><br>攻略：时钟BOSS的攻击方式主要是时间冻结和齿轮攻击。玩家需要根据时钟的攻击模式进行闪避，同时利用场景中的时间机制来反击。配合默契的时机掌控是战胜BOSS的关键，注意在关键时刻使用时钟的弱点攻击。</p>
<h4>5. 雪景球</h4>
<p>剧情简介：小罗斯发现钟表再次运转，兴奋不已。</p>
<p>关卡：</p>
<ul>
<li><strong>热身运动</strong></li>
<li><strong>冬日小镇</strong></li>
<li><strong>冰下世界</strong></li>
<li><strong>滑溜斜坡</strong></li>
</ul>
<p><strong>BOSS：冰雪巨人</strong><br>攻略：冰雪巨人会发射冰冻射线，并在战斗中造成地面崩塌。两名玩家需要协同作战，一人负责引导巨人的攻击，另一人寻找机会攻击巨人的弱点，避免被冰冻和坠落。场景的移动性较高，保持灵活是取胜的关键。</p>
<h4>6. 花园</h4>
<p>剧情简介：两人之间的关心渐渐显现，而在雪景球外的女儿罗斯也因看到光辉再现，心情逐渐好转。</p>
<p>关卡：</p>
<ul>
<li><strong>园艺大师</strong></li>
<li><strong>斩草除根</strong></li>
<li><strong>擅闯禁地</strong></li>
<li><strong>青蛙池塘</strong></li>
<li><strong>苦痛折磨</strong></li>
</ul>
<p><strong>BOSS：植物怪物</strong><br>攻略：植物怪物的攻击方式包括藤蔓缠绕和毒气喷射。玩家需要分工合作，一人控制藤蔓的生长，另一人负责攻击植物的核心区域。利用场景中的工具可以有效削弱BOSS的防御能力，最终将其消灭。</p>
<h4>7. 阁楼</h4>
<p>剧情简介：温室和花园重新恢复了生机，乔伊感激不尽。罗斯看到枯萎的花再次绽放，脸上露出欣喜的笑容。</p>
<p>关卡：</p>
<ul>
<li><strong>布置舞台</strong></li>
<li><strong>演练彩排</strong></li>
<li><strong>闪亮登场</strong></li>
<li><strong>交响乐章</strong></li>
<li><strong>大结局</strong></li>
</ul>
<p><strong>BOSS：音乐盒</strong><br>攻略：音乐盒BOSS的攻击主要是音波震动和机关陷阱。玩家需要协调行动，一人负责破解机关，另一人负责攻击音波源。通过默契配合，在音波攻击时巧妙躲避，并在合适的时机反击，逐步削弱BOSS的能力，最终取得胜利。</p>
<p>这款游戏以其丰富的创意玩法和出色的画面风格著称，获得了年度最佳双人游戏的荣誉。游戏开发者细致入微地考虑了玩家的体验，带来了无与伦比的双人协作乐趣。与情绪稳定的队友共同冒险，会让你在游戏中体验到相互合作的快感，并在挑战中取得胜利！</p>`;

    return (
        <div className="container mx-auto px-4 py-8">
            {/*<ArticleTOC*/}
            {/*    content={articleContent}*/}
            {/*    showTOC={true}*/}
            {/*    tocTitle="目录"*/}
            {/*/>*/}
            <ArticleTOC content={articleContent}/>
        </div>
    );
}

export default TestBox;

