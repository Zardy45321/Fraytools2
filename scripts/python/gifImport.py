import sys
from PIL import Image
from PIL import GifImagePlugin
import os
import PySimpleGUI as sg
import math

import shutil
import json
import uuid
import time

import argparse

cwd = os.getcwd()
data = {}

'''Read JSON contents from given path'''
def getJSONData(path: str):
    with open(path,'r') as file:
        return json.load(file)


def newUUID():
    return str(uuid.uuid4())

def makeAnimation(name):
    jData = {'$id':newUUID(),
             'layers':[],
             'name':name,
             'pluginMetadata':{}
             }
    return jData

def makeLayer(anim):
    new_uuid = newUUID()
    jData = {'$id':new_uuid,
             'hidden':False,
             'keyframes':[],
             'locked':False,
             'name':'Image 0',
             'pluginMetadata':{},
             'type':'IMAGE'
             }
    
    anim['layers'].append(new_uuid)
    return jData

def makeKeyframe(layer,frame_length,symbol):
    new_uuid = newUUID()
    jData = {'$id':new_uuid,
             'length':frame_length,
             'pluginMetadata':{},
             'symbol':symbol,
             'tweenType':'LINEAR',
             'tweened':False,
             'type':'IMAGE'
             }
    layer['keyframes'].append(new_uuid)
    return jData

def makeSymbol(x,y,imageAsset,x_offset,y_offset,x_scale,y_scale,rotation,alpha):
    new_uuid = newUUID()
    jData = {'$id':new_uuid,
             'alpha':alpha,
             'imageAsset':imageAsset,
             'pivotX':x+x_offset,
             'pivotY':y+y_offset/2 + y_offset,
             'pluginMetadata':{},
             'rotation':rotation,
             'scaleX':x_scale,
             'scaleY':y_scale,
             'type':'IMAGE',
             'x':x + x_offset,
             'y':y + y_offset
             }
    return jData,new_uuid

def moveSprites(old_path,new_path):
    shutil.copytree(old_path,new_path,dirs_exist_ok=True)

def deleteSprites(path):
    for f in os.listdir(path):
        #print(f)
        shutil.rmtree(os.path.join(path,f))

    shutil.rmtree(path)

def main(args):
    #print("Hello from Python!")
    #print(sys.argv)
    start = time.time()
    frames_imported = 0
    
    
    gif_directory = args.param1
    sprite_folder = args.param2
    entity = args.param3
    x_offset = float(args.param4)
    y_offset = float(args.param5)
    x_scale = float(args.param6)
    y_scale = float(args.param7)
    rotation = float(args.param8)
    alpha = float(args.param9)
    
    ce_data = getJSONData(entity)

    animations = ce_data['animations']
    layers = ce_data['layers']
    keyframes = ce_data['keyframes']
    symbols = ce_data['symbols']

    #gif_directory = os.path.join(cwd,'GIFS')
    meta_json = {'export':False,'guid':'','id':'','pluginMetadata':{},'plugins':[],'tags':[],'version':2}
    print('Total GIFS: '+str(len(os.listdir(gif_directory))), flush=True)
    g = 0
    for f in os.listdir(gif_directory):
        
        if '.gif' in f:
            
            file_name = f.replace('.gif','')
            data[file_name] = {'frames':[],'uuid':[]}
            directory = os.path.join(cwd,'gifsprites',file_name)
            im = Image.open(os.path.join(gif_directory,f))
            frames = im.n_frames
            len_frames = len(str(frames))
            #print(len_frames)

            anim = makeAnimation(file_name)
            layer = makeLayer(anim)
            if not os.path.exists(directory):
                os.makedirs(directory)
            for x in range(0,frames):
                frames_imported += 1
                im.seek(x)
                #print(im.info['duration']/1000)
                secs = im.info['duration']/1000
                #print((im.info['duration']/1000)*(1/60))
                #print(secs*60)
                frame_count = secs*60
                data[file_name]['frames'].append(math.ceil(frame_count))
                num = str(x)
                while len(num) < len_frames:
                    num = '0'+num
                
                im.save(os.path.join(directory,'{}.png'.format(file_name+num)))
                new_uuid = str(uuid.uuid4())
                meta_json['guid'] = new_uuid
                data[file_name]['uuid'].append(new_uuid)     
                with open(os.path.join(directory,'{}.png.meta'.format(file_name+num)),'w',encoding='utf-8') as file:
                    json.dump(meta_json,file, ensure_ascii=False, indent=4)

                symbol, symbol_uuid = makeSymbol((im.width/2*-1),im.height*-1,new_uuid,x_offset,y_offset,x_scale,y_scale,rotation,alpha)
                keyframe = makeKeyframe(layer,math.ceil(frame_count),symbol_uuid)
                symbols.append(symbol)
                keyframes.append(keyframe)

            animations.append(anim)
            layers.append(layer)
            g += 1
            print('GIF DONE', flush=True)
            

    #print(data)

    moveSprites(os.path.join(cwd,'gifsprites'),sprite_folder)

    deleteSprites(os.path.join(cwd,'gifsprites'))

    ce_data['animations'] = animations
    ce_data['layers'] = layers
    ce_data['keyframes'] = keyframes
    ce_data['symbols'] = symbols

    with open(entity,'w',encoding='utf-8') as file:
        json.dump(ce_data,file, ensure_ascii=False, indent=4)

    completion_time = round(time.time() - start,2)
    
    #deleteSprite(os.path.join(cwd,'sprites'))
    print('STATS: '+str(len(os.listdir(gif_directory)))+','+str(frames_imported)+','+str(completion_time)+' secs')
    #print('Success', flush=True)
    return 'Sucess'
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process some parameters.")
    parser.add_argument('--param1', type=str, required=True, help="The first parameter.")
    parser.add_argument('--param2', type=str, required=True, help="The second parameter.")
    parser.add_argument('--param3', type=str, required=True, help="The first parameter.")
    parser.add_argument('--param4', type=str, required=True, help="The second parameter.")
    parser.add_argument('--param5', type=str, required=True, help="The first parameter.")
    parser.add_argument('--param6', type=str, required=True, help="The second parameter.")
    parser.add_argument('--param7', type=str, required=True, help="The first parameter.")
    parser.add_argument('--param8', type=str, required=True, help="The second parameter.")
    parser.add_argument('--param9', type=str, required=True, help="The first parameter.")
    
    args = parser.parse_args()
    main(args)
