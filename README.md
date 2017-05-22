# AgarProtocol
The Latest Agario Protocol Decoded

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
