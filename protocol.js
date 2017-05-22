function createKey(key) {
 
 
 key = Math.imul(key, 1540483477) >> 0;
    key = (Math.imul(key >>> 24 ^ key, 1540483477) >> 0) ^ 114296087;
    key = Math.imul(key >>> 13 ^ key, 1540483477) >> 0;
    key = key >>> 15 ^ key;
 
 return key;
 
}
buf = new Packet(p.toBuffer());
  console.log("ENCRYPTION KEY: ", encryption_key);
  this.key = encryption_key;
  this.keyBytes = [
   this.key & 255,
   (this.key >>> 8 & 255),
   (this.key >>> 16 & 255),
   (this.key >>> 24 & 255)
  ]
 for(var i=0;i<buf.length;i++){ //ENCRYPT
            var b = buf.readUInt8(i);
            b=b^this.keyBytes[i % 4];
            buf.writeUInt8(b,i);
        }
var encryption_key = 673720360;
  18: function(buf, client) {
   
   console.log("PACKET 18 ! ROTATING THE KEY !");
   
   var new_encryption_key = createKey(encryption_key);
   
   console.log("NEW ENCRYPTION KEY : " + new_encryption_key);
   
   encryption_key = new_encryption_key;
   
  },
hm
ah yes
   sendSpawn: function(name) {

        var buf = new writer(2 + name.length);

        buf.writeUInt8(0);


        for (var i = 0; i < name.length; i++) {
   
            var c = name.charCodeAt(i);
            buf.writeUInt8(c);

        }

        buf.writeUInt8(0);

        var en = new new_packet(buf, true);

  console.log(en.data);
  
        this.ws.send(en.data);

    },
oh
function uncompress(input, output, sIdx, eIdx) {
    sIdx = sIdx || 0
    eIdx = eIdx || (input.length - sIdx)
    // Process each sequence in the incoming data
    for (var i = sIdx, n = eIdx, j = 0; i < n;) {
        var token = input[i++]

        // Literals
        var literals_length = (token >> 4)
        if (literals_length > 0) {
            // length of literals
            var l = literals_length + 240
            while (l === 255) {
                l = input[i++]
                literals_length += l
            }

            // Copy the literals
            var end = i + literals_length
            while (i < end) output[j++] = input[i++]

            // End of buffer?
            if (i === n) return j
        }

        // Match copy
        // 2 bytes offset (little endian)
        var offset = input[i++] | (input[i++] << 8)

        // 0 is an invalid offset value
        if (offset === 0 || offset > j) return -(i - 2)

        // length of match copy
        var match_length = (token & 0xf)
        var l = match_length + 240
        while (l === 255) {
            l = input[i++]
            match_length += l
        }

        // Copy the match
        var pos = j - offset // position of the match copy in the current output
        var end = j + match_length + 4 // minmatch = 4
        while (j < end) output[j++] = output[pos++]
    }

    return j
}
OHHHH
'255': function(client, packet, buf) {
            // var patternLength = (0xFF & 0x0F) + 4;

            function readBytes(buffer, offset, length) {

                var offset = (typeof length) == 'number' ? length : offset;

                return buffer.slice(offset, offset + length);

                offset = offset + length;

            }

            function decimalToHexString(number) {
                if (number < 0) {
                    number = 0xFFFFFFFF + number + 1;
                }

                return number.toString(16).toUpperCase();
            }
            var message_id = 255;

            var offset = packet.offset;

            var packet_id = message_id;

            var Uncompressed_Length = packet.readUInt32LE(1);

            packet.offset += 4;

            var type = packet.readBytes(1); //packet.readUInt8(packet.offset);

            packet.offset += 4;

            var Compression_Offset = packet.readBytes(1); //packet.readBytes(2); //packet.readUInt8(packet.offset);

            packet.offset += 4;

            //console.log("Packet offset: " + packet.offset);

            if (parseInt(Compression_Offset.toString('hex'), 16) >= 255) {

                var Extended_Compression_Offset = packet.readBytes(1);

                packet.offset += 1;
                console.log("Extended_Compression_Offset: " + Extended_Compression_Offset);
            }

            var ca = packet.length - 1;

            var message_compressed = packet.readBytes(ca, true);

            //console.log("Message id: " + packet_id + " Uncompressed Length: " + Uncompressed_Length, "Compression Type: " + type.toString('hex'), "Compression Offset: " + parseInt(Compression_Offset.toString('hex'), 16));  //, "Extended Compression Offset: " + Extended_Compression_Offset.toString('hex'));
            //console.log("Message Compressed: ", packet.toString());

            var sa = parseInt(type.toString('hex'), 16);

            var tid = decimalToHexString(sa);

            var patternLength = (type.toString('hex') & 0x0f) + 4;

            //console.log("Pattern Length: " + patternLength, "Formule: ("+tid+" & 0x0f) + 4");

            var str = message_compressed.toString('hex');
            var d = str.replace(/\s/g, '');
            var buffer_compressed = new Buffer(d, "hex");
            // console.log(buffer_compressed);
            //console.log(buffer_compressed);

            //buffer_compressed.offset = patternLength;
            var lz4 = require("node-lz4");
            //var input = "";

            var input = new Uint8Array(buffer_compressed);

            var output = new Buffer(Uncompressed_Length);

            var uncompressedSize = lz4.decodeBlock(input, output);

            //console.log(Uncompressed_Length);

            output = output.slice(0, uncompressedSize);

            //console.log( "Uncompressed data:", output );
            var packet2 = new Packet(output);
            if (!packet2.length) {
                return this.onPacketError(packet2, new Error('Empty packet received'));
            }

            var packet_id = packet2.readUInt8();
            // console.log("New packet: " + packet_id);

            /*if (sa == 0xf1) {
             
             
             var processor = client.processors[packet_id];
             if(!processor) return client.log('[warning] unknown packet ID(255->' + packet_id + '): ' + packet2.toString());
             processor(client, packet2, type);
   
            }
            else if (sa == 0xf2) {
             
             
             var processor = client.processors[packet_id];
             if(!processor) return client.log('[warning] unknown packet ID(255->' + packet_id + '): ' + packet2.toString());
             processor(client, packet2, type);
   
   

            if (packet_id == 64) {
             
             var processor = client.processors[packet_id];
             if(!processor) return client.log('[warning] unknown packet ID(255->' + packet_id + '): ' + packet2.toString());
             processor(client, packet2, type);

            } else {
             
             //console.log("[WARN] UNDEFINED TYPE OR SKIPED : " + sa);
             return;
             
            }*/

            var processor = client.processors[packet_id];
            if (!processor) return client.log('[warning] unknown packet ID(255->' + packet_id + '): ' + packet2.toString());
            processor(client, packet2, type);
        }
oh yes..
it true
I DONT
 10: function(client, packet, type) {
            if (packet.toString('hex') == '10 00 00 00 00 00 00 00 00') {

                console.log("Clearning...");

                return;


            }
            // if (packet.length < 21) return; 
            console.log(packet.toString('hex'));
            console.log("Packet 16 :D");
            packet.offset = 1;
            var eaters_count = packet.readUInt16LE(1);
            var offset = 3;
            packet.offset = 3;

            client.tick_counter++;
            // console.log(eaters_count);
            //reading eat events
            for (var i = 0; i < eaters_count; i++) {
                var eater_id = packet.readUInt32LE(offset);
                //packet.offset2 += 4;
                var eaten_id = packet.readUInt32LE(offset + 4);
                //packet.offset2 += 4;
                offset = offset + 8;
                if (client.debug >= 4)
                    console.log(eater_id + ' ate ' + eaten_id + ' (' + client.balls[eater_id] + '>' + client.balls[eaten_id] + ')');

                if (!client.balls[eater_id]) new Ball(client, eater_id);
                client.balls[eater_id].update();
                if (client.balls[eaten_id]) client.balls[eaten_id].destroy({
                    'reason': 'eaten',
                    'by': eater_id
                });

                client.emitEvent('somebodyAteSomething', eater_id, eaten_id);
            }

            //reading actions of balls
            while (1) {
                var is_ejected_food_or_virus = false;
                var ball_id;
                var coordinate_x;
                var coordinate_y;
                var size;
                var color;
                var nick = null;
                var Skin_name = ''; //Premium skin ^^
                var isEjecting = false;
                var isAgitated = false;
                var lvl = 0;
                if (packet.length < offset + 4) break;


                ball_id = packet.readUInt32LE(offset);

                if (ball_id == 0) {

                    //offset += 4;
                    console.log("Ball_ID = 0");
                    break;
                }

                offset += 4;

                coordinate_x = packet.readSInt32LE(offset);
                offset += 4;

                coordinate_y = packet.readSInt32LE(offset);
                offset += 4;

                size = packet.readUInt16LE(offset);
                offset += 2;

                var maxLen = 15;
                var lon = -1;
HAVE
  var s = 0;



                var flags = packet.readUInt8(offset);
                offset += 1;
                console.log("Flags: " + flags);


                is_ejected_food_or_virus = !!(flags & 1);

                var isColorPresent = !!(flags & 2);

                var isSkinPresent = !!(flags & 4);

                var isPlayerName = !!(flags & 8);

                isAgitated = !!(flags & 10);

                if (isColorPresent == true) {

                    console.log("Color Present");

                    var color_R = packet.readUInt8(offset);

                    offset += 1;
                    var color_G = packet.readUInt8(offset);

                    offset += 1;
                    var color_B = packet.readUInt8(offset);

                    offset += 1;

                    color = (color_R << 16 | color_G << 8 | color_B).toString(16);
                    color = '#' + ('000000' + color).substr(-6);


                    console.log(color);

                }

                if (flags == 130) {

                    console.log("is_ejected_food_or_virus " + is_ejected_food_or_virus);

                    var what_is_ejected_food_or_virus = packet.readUInt8(offset);

                    offset += 1;

                    if (what_is_ejected_food_or_virus == 0x1d) {

                        console.log("IS a ????");
THE

                    } else if (what_is_ejected_food_or_virus == 0xff) {

                        console.log("IS an EJECTED MASS !!!");

                    } else if (what_is_ejected_food_or_virus == 0x07) {

                        console.log("IS a ????");

                    } else if (what_is_ejected_food_or_virus == 0x28) {

                        console.log("IS a ????");

                    } else if (what_is_ejected_food_or_virus == 0x88) {

                        console.log("IS a ????");

                    } else if (what_is_ejected_food_or_virus == 0x46) {

                        console.log("IS a ????");

                    } else if (what_is_ejected_food_or_virus == 0x01) {

                        console.log("IS a virus !");

                    } else {

                        console.log("Null type pls add : " + what_is_ejected_food_or_virus);

                    }


                }


                if (isAgitated) {

                    console.log("This player or virus or food ejected is moving !");

                }


                if (isSkinPresent) {
                    while (1) {
                        var char = packet.readUInt8(offset);
                        offset++;
                        packet.offset = of
FUCKING
fset;

                        if (char == 0) {
                            break;
                        } else {

                            if (!Skin_name) Skin_name = '';
                            Skin_name += String.fromCharCode(char);
                        }

                    }
                    if (Skin_name != '') {

                        console.log(Skin_name);
                    }
                }

               if (isPlayerName) {
                              
     while(1) {
      char = packet.readUInt8();
      if(char == 0) break;
      if(!nick) nick = '';
      if(char<192){
      nick += String.fromCharCode(char);
      }else{
       if(char<224){
       var _1 = packet.readUInt8() % 64;
       nick += String.fromCharCode((char % 32) * 64 + _1); 
       }else{
       if(char<240){
       var _1 = (packet.readUInt8() % 64) * 64;
       var _2 = packet.readUInt8() % 64;
       nick += String.fromCharCode((char % 16) * 4096 + 1 + 2);  
       }else{
       var _1 = (packet.readUInt8() % 64) * 4096;
       var _2 = (packet.readUInt8() % 64) * 64;
       var _3 = packet.readUInt8() % 64;
       var c = (char % 8) * 262144 + 1 + 2 + _3;
       nick += String.fromCharCode((c-65536)/1024+55296);
       nick += String.fromCharCode((c-65536)%1024+56320);
       }
       }
      }
      
     
     }
      if (nick != '' && nick != null) {

                        console.log(nick);
                    }
                }

     
     
    /*
     
                    // offset = 18;
                    while (1) {
                        if (s < maxLen) {


                            var char = packet.readUInt8(offset);
                            offset++;
                            packet.offset = offset;

                            if (char == 0) {
                                console.log("NICK_NAME OF THIS PLAYER: " + nick);
                                break;
                            } else {

                                if (!nick) nick = '';
                                nick += String.fromCharCode(char);
                            }


                        } else {

                            console.log("[ERROR] [PACKET_16] [NICKNAME DECODING] at line 449++ code = 6");

                        }

                    }
                    if (nick != '' && nick != null) {

                        console.log(nick);
                    }

                
*/
                var ball = client.balls[ball_id] || new Ball(client, ball_id);
                ball.color = color;
                ball.virus = is_ejected_food_or_virus;
                ball.setCords(coordinate_x, coordinate_y);
                ball.setSize(size);
                if (nick) ball.setName(nick);
                //if(Skin_name) ball.setSkin(Skin_name);
                ball.update_tick = client.tick_counter;
                ball.appear();
                ball.update();

                //if(client.debug >= 5)
                console.log('action: ball_id=' + ball_id + ' coordinate_x=' + coordinate_x + ' coordinate_y=' + coordinate_y + ' size=' + size + ' is_ejected_food_or_virus=' + is_ejected_food_or_virus + ' nick=' + nick + ' Skin name=' + Skin_name);
                packet.offset = offset;
                client.emitEvent('ballAction', ball_id, coordinate_x, coordinate_y, size, is_ejected_food_or_virus, nick);
                //offset -= 4;
                //break;
            }



            //if (offset2 + 8 < packet.length) {

            var balls_on_screen_count = packet.readUInt32LE(offset);
            offset = offset + 4;

            console.log(balls_on_screen_count);
            //disappear events
            for (i = 0; i < balls_on_screen_count; i++) {
                offset = packet.length;
                packet.offset = packet.length;
                break;
                ball_id = packet.readUInt32LE(offset2);
                offset2 = offset2 + 4;

                ball = client.balls[ball_id] || new Ball(client, ball_id);
                if (ball.mine) {
                    ball.destroy({
                        reason: 'merge'
                    });
                    client.emitEvent('merge', ball.id);
                } else {
                    ball.disappear();
                    ball.update_tick = client.tick_counter;
                    ball.update();
                }
            }

            //}


        },
