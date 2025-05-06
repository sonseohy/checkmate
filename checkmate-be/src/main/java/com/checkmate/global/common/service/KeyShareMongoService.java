package com.checkmate.global.common.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeyShareMongoService {
    private final MongoTemplate mongo;

    /** shareB를 저장 */
    public void saveShareB(Long fileId, byte[] shareB) {
        Document doc = new Document("fileId", fileId)
                .append("shareB", shareB);
        mongo.save(doc, "keyShare");
    }

    /** shareB를 조회 */
    public byte[] loadShareB(Long fileId) {
        Document doc = mongo.findById(fileId, Document.class, "keyShare");
        if (doc == null) throw new RuntimeException("키 조각 B 미존재: " + fileId);
        return doc.get("shareB", org.bson.types.Binary.class).getData();
    }
}
