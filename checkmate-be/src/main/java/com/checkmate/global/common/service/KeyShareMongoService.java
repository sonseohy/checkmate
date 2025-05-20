package com.checkmate.global.common.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeyShareMongoService {
    private final MongoTemplate mongo;

    /**
     * shareB를 MongoDB에 저장
     *
     * @param fileId 파일 식별자
     * @param shareB 저장할 키 조각
     */
    public void saveShareB(Long fileId, byte[] shareB) {
        Document doc = new Document("fileId", fileId)
                .append("shareB", shareB);
        mongo.save(doc, "keyShare");
    }

    /**
     * shareB를 MongoDB에서 조회
     *
     * @param fileId 파일 식별자
     * @return 키 조각 바이트 배열
     */
    public byte[] loadShareB(Long fileId) {
        Query query = Query.query(Criteria.where("fileId").is(fileId));
        Document doc = mongo.findOne(query, Document.class, "keyShare");
        if (doc == null) throw new RuntimeException("키 조각 B 미존재: " + fileId);
        return doc.get("shareB", org.bson.types.Binary.class).getData();
    }
}
