from pathlib import Path
import math, subprocess, wave, struct
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
W,H,FPS,DURATION = 1280,720,24,36
FONT='/System/Library/Fonts/STHeiti Medium.ttc'
WHITE='#f4f7ff'; MUTED='#9daeca'; CYAN='#50ead6'; BLUE='#6b8cff'
scenes=[
 ('一个人玩，也能一起玩。','把单人游戏，连接到真人玩家。','你的单人游戏，能不能和朋友一起玩？试试 Game Link。'),
 ('GameLink','让单人游戏，实现真人联机','通过接入 Game Link SDK，让你的单人游戏实现真人联机。'),
 ('接入 SDK + 配置说明','从接入，到一起玩。','一个 SDK，加一份配置说明。连接房间，接入游戏状态同步。'),
 ('创建房间 · 邀请朋友','真人玩家，进入同一个游戏世界。','创建房间，邀请朋友。让真人玩家，进入同一个游戏世界。'),
 ('为你的游戏，接上联机能力','JavaScript / TypeScript   ·   Godot 4   ·   Rust','支持 JavaScript、Godot 和 Rust。让你的游戏，多一种一起玩的方式。'),
 ('欢迎使用 GameLink','接入 SDK，让下一局不再孤单。','Game Link，连接游戏，也连接玩家。欢迎使用。')]
FOOTAGE = sorted((ROOT/'captures'/'frames').glob('*.png'))
LOGO = Image.open(ROOT/'assets'/'gamelink-logo.png').convert('RGBA')
LOGO = LOGO.crop(LOGO.getbbox())

def logo(im, center, width):
    height=round(LOGO.height*width/LOGO.width)
    asset=LOGO.resize((width,height),Image.Resampling.LANCZOS)
    im.paste(asset,(round(center[0]-width/2),round(center[1]-height/2)),asset)

def font(n): return ImageFont.truetype(FONT,n)
def text(d,xy,s,size=32,fill=WHITE,anchor='mm'): d.text(xy,s,font=font(size),fill=fill,anchor=anchor)
def panel(d,box,fill='#101e36',outline='#293e61',radius=22): d.rounded_rectangle(box,radius,fill,outline,width=2)
def player(d,x,y,color,label,t):
    y+=math.sin(t*2+x)*9
    d.ellipse((x-22,y-58,x+22,y-14),fill=color)
    d.rounded_rectangle((x-34,y-8,x+34,y+54),16,fill=color)
    text(d,(x,y+83),label,20,color)
def frame(t):
    s=min(5,int(t/6)); u=t-s*6
    im=Image.new('RGB',(W,H),'#080f20'); d=ImageDraw.Draw(im)
    for x in range(-100,W+100,64):
        xx=x+int(t*9)%64; d.line((xx,0,xx,H),fill='#111c31')
    for y in range(0,H,64): d.line((0,y,W,y),fill='#111c31')
    for j in range(30):
        x=(j*137+t*(10+j%4*3))%W; y=(j*79)%H
        d.ellipse((x,y,x+3,y+3),fill='#284361')
    logo(im,(135,47),150)
    text(d,(1216,44),'PLAY TOGETHER',18,MUTED,'rm')
    title,sub,_=scenes[s]
    if s in (1,3) and FOOTAGE:
        shot=Image.open(FOOTAGE[min(len(FOOTAGE)-1,int((u+(6 if s==3 else 0))*FPS))]).convert('RGB')
        shot.thumbnail((1160,480))
        im.paste(shot,((W-shot.width)//2,133))
        d=ImageDraw.Draw(im)
        text(d,(640,98),'实际游戏联机 · 多人坦克竞技场',34)
        text(d,(1158,44),'双客户端实录',18,CYAN,'rm')
    elif s in (0,1,3):
        panel(d,(180,185,1100,505))
        d.line((225,439,1055,439),fill='#35526a',width=3)
        if s==0:
            player(d,640,330,BLUE,'PLAYER 01',t)
            text(d,(640,218),'SINGLE PLAYER',19,MUTED)
        else:
            for x,c,label in [(390,BLUE,'PLAYER 01'),(640,CYAN,'PLAYER 02'),(890,'#ffbc75','PLAYER 03')]:
                player(d,x,330,c,label,t)
            d.line((390,240,890,240),fill=CYAN,width=3)
            for x in (390,640,890): d.ellipse((x-5,235,x+5,245),fill=CYAN)
            text(d,(640,211),'ROOM  /  FRIENDS CONNECTED',19,CYAN)
        if s==1: logo(im,(640,113),265)
        else: text(d,(640,114),title,51)
        text(d,(640,558),sub,30,MUTED)
    elif s==2:
        text(d,(640,135),title,52)
        for box,tag,name,lines in [((150,235,585,475),'01','SDK',['连接房间 / 玩家发现','发送与接收游戏消息']),((695,235,1130,475),'02','配置说明',['设置 game_id 与服务地址','接入游戏状态同步'])]:
            panel(d,box); x=(box[0]+box[2])/2
            text(d,(box[0]+30,box[1]+35),tag,20,CYAN,'lm')
            text(d,(x,box[1]+84),name,40)
            for j,line in enumerate(lines): text(d,(x,box[1]+153+j*38),line,24,MUTED)
        text(d,(640,352),'+',52,CYAN)
        text(d,(640,544),sub,31,CYAN)
    elif s==4:
        text(d,(640,160),title,46)
        for j,(name,desc) in enumerate([('JS / TS','浏览器游戏'),('Godot 4','GDScript'),('Rust','原生客户端')]):
            x=140+j*350; panel(d,(x,265,x+300,462))
            text(d,(x+150,333),name,37,CYAN)
            text(d,(x+150,401),desc,25,MUTED)
        text(d,(640,538),'房间管理  /  玩家发现  /  消息传输',28,MUTED)
    else:
        logo(im,(640,185),470)
        text(d,(640,314),title,62)
        text(d,(640,396),sub,32,CYAN)
        panel(d,(380,467,900,531),fill='#183b43',outline=CYAN)
        text(d,(640,498),'让下一局，一起玩。',30,WHITE)
    # Persistent subtitles, safely within frame.
    panel(d,(75,622,1205,682),fill='#101a2b',outline='#101a2b',radius=14)
    text(d,(640,652),scenes[s][2],24)
    d.rectangle((0,710,int(W*t/DURATION),719),fill=CYAN)
    # Gentle scene fades preserve readable type.
    fade=min(1,u/.35,(6-u)/.35)
    if fade<1: im=Image.blend(Image.new('RGB',(W,H),'#080f20'),im,max(0,fade))
    return im

def main():
    for i,(_,_,speech) in enumerate(scenes):
        subprocess.run(['say','-v','Tingting','-r','235','-o',str(ROOT/f'voice-{i}.aiff'),speech],check=True)
    # Quiet original synthesized music: soft chords and a light pulse.
    sr=44100
    with wave.open(str(ROOT/'music.wav'),'wb') as f:
        f.setparams((1,2,sr,0,'NONE','not compressed'))
        out=bytearray()
        chords=[(130.81,164.81,196),(110,130.81,164.81),(87.31,110,130.81),(98,123.47,146.83)]
        for i in range(sr*DURATION):
            t=i/sr; notes=chords[int(t/3)%4]
            env=min(1,t/2,(DURATION-t)/2)
            val=sum(math.sin(2*math.pi*n*t)*.028 for n in notes)
            pulse=math.exp(-((t%.5)*20))*math.sin(2*math.pi*65*t)*.045
            out.extend(struct.pack('<h',int((val+pulse)*env*32767)))
        f.writeframes(out)
    cmd=['ffmpeg','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p',str(ROOT/'silent.mp4')]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=open(ROOT/'render.log','w'))
    for i in range(FPS*DURATION): p.stdin.write(frame(i/FPS).tobytes())
    p.stdin.close()
    if p.wait(): raise RuntimeError('Video render failed')
    inputs=['-i',str(ROOT/'silent.mp4'),'-i',str(ROOT/'music.wav')]
    filters=['[1:a]volume=0.48[music]']
    for i in range(6):
        inputs+=['-i',str(ROOT/f'voice-{i}.aiff')]
        filters.append(f'[{i+2}:a]apad,atrim=0:5.8,adelay={i*6000}|{i*6000}[v{i}]')
    filters.append('[music]'+''.join(f'[v{i}]' for i in range(6))+'amix=inputs=7:normalize=0,alimiter=limit=0.95[a]')
    subprocess.run(['ffmpeg','-y',*inputs,'-filter_complex',';'.join(filters),'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-t','36','-movflags','+faststart',str(ROOT/'GameLink-宣传介绍.mp4')],check=True,stderr=open(ROOT/'audio.log','w'))
    frame(31.5).save(ROOT/'cover.png')
    sheet=Image.new('RGB',(960,540))
    for i in range(6): sheet.paste(frame(i*6+3).resize((320,270)),((i%3)*320,(i//3)*270))
    sheet.save(ROOT/'storyboard.jpg')
if __name__=='__main__': main()
