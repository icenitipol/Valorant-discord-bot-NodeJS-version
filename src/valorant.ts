import axios from 'axios'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { MessageAttachment, MessageEmbed } from 'discord.js'
registerFont('../assets/ValorantFont.ttf', { family: 'modern sans' })

type authType = {
    headers: {
        'Authorization': string,
        'X-Riot-Entitlements-JWT': string
    },
    userid: string
}

type offerV1 = {
    "OfferID": string,
    "IsDirectPurchase": boolean,
    "StartDate": string,
    "Cost": { [key: string]: number },
    "Rewards": [
        {
            "ItemTypeID": string,
            "ItemID": string,
            "Quantity": number
        }
    ]
}

type skins = { name: string, icon: string, price: number }

const makeCookieFromArray = (cookies: string[]) => {
    let data = ""
    cookies.forEach(e => {
        data = data.concat(`${e};`)
    })
    return data
}

export const auth = (username: string, password: string): Promise<authType> => {
    return new Promise(async (resolve, reject) => {
        try {

            /*
                GET VARORANT LOGIN PASS
            */
            const valorantcookie: string[] = await axios.post('https://auth.riotgames.com/api/v1/authorization', {
                'client_id': 'play-valorant-web-prod',
                'nonce': '1',
                'redirect_uri': 'https://playvalorant.com/opt_in',
                'response_type': 'token id_token',
            }).then(axiosresult => { return axiosresult.headers['set-cookie'] ?? [] })


            /*
                GET RIOT ACCOUNT ACCESS TOKEN
            */
            const riotauth_token = await axios.put('https://auth.riotgames.com/api/v1/authorization', {
                'type': 'auth',
                'username': username,
                'password': password,
            }, { headers: { Cookie: makeCookieFromArray(valorantcookie) } }).then(axiosresult => {
                const data = axiosresult.data.response?.parameters?.uri as string ?? ""
                const access_token_regex = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/g;
                const foundData = [...data.matchAll(access_token_regex)][0]
                if (!foundData) return null
                return foundData[1]
            })

            if (!riotauth_token) { return reject("user/pass api error") }

            /*
                GET RIOT ENTITLEMENT ACCESS TOKEN
            */
            const entitlements_token = await axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                headers: { 'Authorization': `Bearer ${riotauth_token}` }
            }).then(axiosresult => axiosresult.data.entitlements_token as string ?? "")


            /*
                GET RIOT USER ID
            */
            const riot_user_id = await axios.post('https://auth.riotgames.com/userinfo', {}, {
                headers: { 'Authorization': `Bearer ${riotauth_token}` }
            }).then(axiosresult => axiosresult.data.sub ?? "")

            if (!riot_user_id || !entitlements_token || !riotauth_token) return reject(false)

            return resolve({
                headers: {
                    'Authorization': `Bearer ${riotauth_token}`,
                    'X-Riot-Entitlements-JWT': entitlements_token
                },
                userid: riot_user_id,
            })
        }
        catch (err) {
            console.log("AUTH ERROR", err)
            return reject(false)
        }
    })
}

export const getOffer = (riotAuthData: authType): Promise<skins[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let skins: skins[] = []

            const offers: string[] = await axios.get(`https://pd.ap.a.pvp.net/store/v2/storefront/${riotAuthData.userid}`, {
                headers: riotAuthData.headers
            }).then(axiosresult => axiosresult.data.SkinsPanelLayout?.SingleItemOffers ?? [])

            const offers_prices: offerV1[] = await axios.get('https://pd.ap.a.pvp.net/store/v1/offers/', {
                headers: riotAuthData.headers
            }).then(axiosresult => axiosresult.data.Offers ?? [])


            for (let offer of offers) {
                await axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${offer}`).then(axiosresult => {
                    for (let offer_price of offers_prices)
                        if (offer_price.OfferID == offer) {
                            const varorantSkinData = axiosresult.data.data
                            skins.push({
                                icon: varorantSkinData.displayIcon as string ?? "",
                                name: varorantSkinData.displayName as string ?? "",
                                price: offer_price.Cost[Object.keys(offer_price.Cost)[0]]
                            })
                            // console.log({offer, varorantSkinData, skins})
                        }
                })
            }

            // console.log({skins})

            return resolve(skins)
        }
        catch (err) {
            console.log("GET OFFER ERROR", err)
            return reject(false)
        }

    })
}

export const getOfferImage = (offers: skins[]): Promise<Buffer> => {
    return new Promise(async (resolve, reject) => {
        try {
            const skin1 = await loadImage(offers[0].icon)
            const skin2 = await loadImage(offers[1].icon)
            const skin3 = await loadImage(offers[2].icon)
            const skin4 = await loadImage(offers[3].icon)

            const bg = await loadImage('../assets/background.png')

            const width = bg.width
            const height = bg.height

            const canvas = createCanvas(width, height)
            const context = canvas.getContext('2d')

            const getSizeKeepAspectRatio = (width: number, height: number, limw: number, limh: number) => {
                let ratiow = width > limw ? limw / width : 1
                let ratioh = height > limh ? limh / height : 1
                let minratio = Math.min(ratiow, ratioh)
                return {
                    width: Math.round(width * minratio),
                    height: Math.round(height * minratio),
                }
            }
            context.fillStyle = '#fff'
            context.drawImage(bg, 0, 0)

            const skin1_resize = getSizeKeepAspectRatio(skin1.width, skin1.height, 500, 120)
            const skin2_resize = getSizeKeepAspectRatio(skin2.width, skin2.height, 500, 120)
            const skin3_resize = getSizeKeepAspectRatio(skin3.width, skin3.height, 500, 120)
            const skin4_resize = getSizeKeepAspectRatio(skin4.width, skin4.height, 500, 120)

            context.drawImage(skin1, 25, 60, skin1_resize.width, skin1_resize.height)
            context.drawImage(skin2, 625, 60, skin2_resize.width, skin2_resize.height)
            context.drawImage(skin3, 25, 310, skin3_resize.width, skin3_resize.height)
            context.drawImage(skin4, 625, 310, skin4_resize.width, skin4_resize.height)

            context.textBaseline = "hanging";

            context.font = '35px "modern sans"'
            context.fillText(offers[0].price + "", 500, 25)
            context.fillText(offers[1].price + "", 1095, 25)
            context.fillText(offers[2].price + "", 500, 273)
            context.fillText(offers[3].price + "", 1095, 273)

            context.font = '30px "modern sans"'
            context.fillText(offers[0].name, 25, 205)
            context.fillText(offers[1].name, 620, 205)
            context.fillText(offers[2].name, 25, 455)
            context.fillText(offers[3].name, 620, 455)

            const buffer = canvas.toBuffer('image/png')
            return resolve(buffer)
        }
        catch (error) {
            console.log("DOWNLOAD SKIN IMAGE ERROR", error)
            return reject(false)
        }
    })
}

export const getOfferMessage = (username: string, password: string, user: string, user_pic_url: string = 'https://i.imgur.com/AfFp7pu.png'): Promise<{ embeds: MessageEmbed[], files: MessageAttachment[] }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const riotAuthData = await auth(username, password).catch(err => { throw new Error("auth:" + err) })
            const offers = await getOffer(riotAuthData).catch(err => { throw new Error("offers:" + err) })
            const offerImage = await getOfferImage(offers).catch(err => { throw new Error("img:" + err) })

            const file = new MessageAttachment(offerImage, "valorant_store.png");
            const exampleEmbed = new MessageEmbed()
                .setColor('#fe676e')
                .setTitle('VALORANT STORE')
                .setImage('attachment://valorant_store.png')
                .setTimestamp()
                .setFooter({ text: `Requested By [${user}, ACC:${username}]`, iconURL: user_pic_url });

            return resolve({ embeds: [exampleEmbed], files: [file] })
        }
        catch (error) {
            console.log("ERROR", error)
            return reject(false)
        }
    })
}